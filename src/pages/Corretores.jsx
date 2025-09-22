import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users as UsersIcon } from "lucide-react";
import CorretorCard from "@/components/corretores/CorretorCard";
import CorretorForm from "@/components/corretores/CorretorForm";
import AccessDenied from "@/components/common/AccessDenied";
import { createUser, updateUser } from "@/services/UserService";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { UserFilters } from "@/components/corretores/UserFilters";
import { CorretoresSkeleton } from "@/components/corretores/CorretoresSkeleton";

import debounce from "lodash/debounce";
import { toast } from "sonner";

export default function Corretores() {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCorretor, setEditingCorretor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [perfilFilter, setPerfilFilter] = useState("todos");
    const { allUsers, isLoading, error, reload } = useFetchUsers(user);
    const deferredSearchTerm = React.useDeferredValue(searchTerm);

    useEffect(() => {
        if (user) {
            setCurrentUser({
                userId: user.sub,
                perfil: user.scope,
                email: user.email || "",
                nome: user.nome || "",
            });
        } else {
            setCurrentUser(null);
        }
    }, [user]);

    const filteredCorretores = useMemo(() => {
        let filtered = [...allUsers];

        if (deferredSearchTerm) {
            filtered = filtered.filter(
                (corretor) =>
                    corretor.nome
                        ?.toLowerCase()
                        .includes(deferredSearchTerm.toLowerCase()) ||
                    corretor.email
                        ?.toLowerCase()
                        .includes(deferredSearchTerm.toLowerCase()) ||
                    corretor.telefone?.includes(deferredSearchTerm)
            );
        }

        if (perfilFilter !== "todos") {
            filtered = filtered.filter((corretor) =>
                corretor.roles.some((role) => role.nome === perfilFilter)
            );
        }

        return filtered;
    }, [allUsers, deferredSearchTerm, perfilFilter]);

    const handleSave = async (data) => {
        try {
            if (editingCorretor) {
                await updateUser(editingCorretor.userId, {
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    creci: data.creci,
                    ativo: data.ativo,
                    gerenteId: data.gerenteId,
                    role: data.role,
                });
                toast.success("Corretor atualizado com sucesso!");
            } else {
                await createUser({
                    ...data,
                    gerenteId:
                        currentUser.perfil === "GERENTE"
                            ? currentUser.userId
                            : data.gerenteId,
                    role: data.perfil,
                });
                toast.success("Corretor criado com sucesso!");
            }
            setShowForm(false);
            setEditingCorretor(null);
            reload();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error(`Erro ao salvar: ${error.message}`);
        }
    };

    const handleEdit = (corretor) => {
        setEditingCorretor(corretor);
        setShowForm(true);
    };

    const handleToggleStatus = async (corretor) => {
        try {
            await updateUser(corretor.userId, {
                nome: corretor.nome,
                email: corretor.email,
                telefone: corretor.telefone,
                creci: corretor.creci,
                ativo: !corretor.ativo,
                gerenteId: corretor.gerenteId,
                role: corretor.roles[0].nome,
            });
            toast.success(
                `Status alterado para ${
                    !corretor.ativo ? "Ativo" : "Inativo"
                } com sucesso!`
            );
            reload();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            toast.error(`Erro ao alterar status: ${error.message}`);
        }
    };

    const getPageTitle = () =>
        currentUser?.perfil === "ADMIN"
            ? "Gerentes e Corretores"
            : "Sua Equipe";
    const getPageDescription = () =>
        currentUser?.perfil === "ADMIN"
            ? "Gerencie gerentes e corretores da imobiliária"
            : "Gerencie os corretores da sua equipe";

    if (error && !isLoading) {
        return (
            <div className="p-6 text-red-500">
                {error}
                <Button onClick={reload} className="ml-4">
                    Tentar novamente
                </Button>
            </div>
        );
    }

    if (
        !isLoading &&
        currentUser &&
        !["ADMIN", "GERENTE"].includes(currentUser.perfil)
    ) {
        return <AccessDenied />;
    }

    if (isLoading) {
        return <CorretoresSkeleton />;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {getPageTitle()}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {getPageDescription()}
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingCorretor(null);
                            setShowForm(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {currentUser?.perfil === "ADMIN"
                            ? "Novo Usuário"
                            : "Novo Corretor"}
                    </Button>
                </div>

                <UserFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    perfilFilter={perfilFilter}
                    setPerfilFilter={setPerfilFilter}
                    currentUser={currentUser}
                />

                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredCorretores.length} usuários encontrados
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCorretores.map((corretor) => (
                        <CorretorCard
                            key={corretor.userId}
                            corretor={corretor}
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                </div>

                {filteredCorretores.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UsersIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum usuário encontrado
                        </h3>
                        <p className="text-gray-500">
                            Tente ajustar a busca ou adicione um novo usuário
                        </p>
                    </div>
                )}
            </div>

            {showForm && (
                <CorretorForm
                    corretor={editingCorretor}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingCorretor(null);
                    }}
                    currentUser={currentUser}
                    allUsers={allUsers}
                />
            )}
        </div>
    );
}
