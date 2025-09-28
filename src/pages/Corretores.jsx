import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CorretorForm from "@/components/corretores/corretorForm/CorretorForm";
import AccessDenied from "@/components/common/AccessDenied";
import { createUser, updateUser } from "@/services/UserService";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { UserFilters } from "@/components/corretores/corretorPage/UserFilters";
import { CorretoresSkeleton } from "@/components/corretores/corretorPage/CorretoresSkeleton";
import CorretorTable from "@/components/corretores/corretorTable/CorretorTable";
import { toast } from "sonner";

export default function Corretores() {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const { allUsers, isLoading, error, reload } = useFetchUsers(user);
    const [showForm, setShowForm] = useState(false);
    const [editingCorretor, setEditingCorretor] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState("nome");
    const [sortOrder, setSortOrder] = useState("asc");
    const [perfilFilter, setPerfilFilter] = useState("todos");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [corretorToToggle, setCorretorToToggle] = useState(null);
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
                corretor.roles?.some((role) => role.nome === perfilFilter)
            );
        }

        filtered.sort((a, b) => {
            if (sortField === "nome") {
                const valueA = a.nome?.toLowerCase() || "";
                const valueB = b.nome?.toLowerCase() || "";
                return sortOrder === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            } else if (sortField === "createdDate") {
                const dateA = new Date(a.createdDate);
                const dateB = new Date(b.createdDate);
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });

        return filtered;
    }, [allUsers, deferredSearchTerm, perfilFilter, sortField, sortOrder]);

    const paginatedCorretores = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredCorretores.slice(start, start + pageSize);
    }, [filteredCorretores, currentPage, pageSize]);

    const pagination = useMemo(
        () => ({
            currentPage,
            totalPages: Math.ceil(filteredCorretores.length / pageSize),
            totalItems: filteredCorretores.length,
            pageSize,
        }),
        [filteredCorretores, currentPage, pageSize]
    );

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
    };

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

    const handleToggleStatus = (corretor) => {
        setCorretorToToggle(corretor);
        setShowStatusModal(true);
    };

    const confirmToggleStatus = async () => {
        if (!corretorToToggle) return;
        try {
            await updateUser(corretorToToggle.userId, {
                nome: corretorToToggle.nome,
                email: corretorToToggle.email,
                telefone: corretorToToggle.telefone,
                creci: corretorToToggle.creci,
                ativo: !corretorToToggle.ativo,
                gerenteId: corretorToToggle.gerenteId,
                role: corretorToToggle.roles?.[0]?.nome || "CORRETOR",
            });
            toast.success(
                `Status alterado para ${
                    !corretorToToggle.ativo ? "Ativo" : "Inativo"
                } com sucesso!`
            );
            reload();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
            toast.error(`Erro ao alterar status: ${error.message}`);
        } finally {
            setShowStatusModal(false);
            setCorretorToToggle(null);
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
                        {filteredCorretores.length} corretores encontrados
                    </p>
                </div>

                <CorretorTable
                    paginatedCorretores={paginatedCorretores}
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                    handlePageSizeChange={handlePageSizeChange}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isLoading}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                />

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
        </div>
    );
}
