import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Users as UsersIcon, Filter } from "lucide-react";
import CorretorCard from "../components/corretores/CorretorCard";
import CorretorForm from "../components/corretores/CorretorForm";
import { fetchUsers, createUser, updateUser } from "@/services/UserService";
import { useAuth } from "@/contexts/AuthContext";

export default function Corretores() {
    const { user } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [filteredCorretores, setFilteredCorretores] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCorretor, setEditingCorretor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [perfilFilter, setPerfilFilter] = useState("todos");

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

    const loadData = async () => {
        if (!user) {
            setIsLoading(false);
            setError("Usuário não autenticado");
            setAllUsers([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const usersData = await fetchUsers();
            const validUsers = Array.isArray(usersData) ? usersData : [];
            setAllUsers(validUsers);
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
            setError(err.message);
            setAllUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const applyFilters = useCallback(() => {
        let filtered = [...allUsers];

        if (searchTerm) {
            filtered = filtered.filter(
                (corretor) =>
                    corretor.nome
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    corretor.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    corretor.telefone?.includes(searchTerm)
            );
        }

        if (perfilFilter !== "todos") {
            filtered = filtered.filter((corretor) =>
                corretor.roles.some((role) => role.nome === perfilFilter)
            );
        }

        setFilteredCorretores(filtered);
    }, [allUsers, searchTerm, perfilFilter]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

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
            } else {
                await createUser({
                    ...data,
                    gerenteId:
                        currentUser.perfil === "GERENTE"
                            ? currentUser.userId
                            : data.gerenteId,
                    role: data.perfil,
                });
            }
            setShowForm(false);
            setEditingCorretor(null);
            loadData();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar: " + error.message);
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
            loadData();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            alert("Erro ao alterar status: " + error.message);
        }
    };

    const getPageTitle = () => {
        if (currentUser?.perfil === "ADMIN") {
            return "Gerentes e Corretores";
        }
        return "Sua Equipe";
    };

    const getPageDescription = () => {
        if (currentUser?.perfil === "ADMIN") {
            return "Gerencie gerentes e corretores da imobiliária";
        }
        return "Gerencie os corretores da sua equipe";
    };
    if (!isLoading && error) {
        return (
            <div className="p-6 text-red-500">
                {error}
                <Button onClick={loadData} className="ml-4">
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
        return (
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UsersIcon className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Acesso Negado
                        </h3>
                        <p className="text-gray-500">
                            Apenas administradores e gerentes podem acessar esta
                            página
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(6)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="h-48 bg-gray-200 rounded-lg"
                                ></div>
                            ))}
                    </div>
                </div>
            </div>
        );
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

                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {currentUser?.perfil === "ADMIN" && (
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <Select
                                    value={perfilFilter}
                                    onValueChange={setPerfilFilter}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">
                                            Todos os Perfis
                                        </SelectItem>
                                        <SelectItem value="GERENTE">
                                            Apenas Gerentes
                                        </SelectItem>
                                        <SelectItem value="CORRETOR">
                                            Apenas Corretores
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

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

                {filteredCorretores.length === 0 && !isLoading && (
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
