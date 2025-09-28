import React, { useState, useMemo, useEffect } from "react";
import ClientesHeader from "@/components/clientes/clientePage/ClientesHeader";
import ClientesTable from "@/components/clientes/clienteTable/ClientesTable";
import ClienteForm from "@/components/clientes/clienteForm/ClienteForm";
import DeleteConfirmationModal from "@/components/clientes/clientePage/DeleteConfirmationModal";
import { ClientesFilters } from "@/components/clientes/clientePage/ClientesFilters";
import { ClientesSkeleton } from "@/components/clientes/clientePage/ClientesSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import useClientesData from "@/hooks/useClientesData";
import {
    createCliente,
    updateCliente,
    deleteCliente,
} from "@/services/ClienteService";
import { toast } from "sonner";

export default function Clientes() {
    const { user } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const { allClientes, imoveis, isLoading, reload } = useClientesData(user);
    const [showForm, setShowForm] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState("nome");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const deferredSearchTerm = React.useDeferredValue(searchTerm);
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

    const clientImoveisMap = useMemo(() => {
        const map = {};
        imoveis.forEach((imovel) => {
            if (!map[imovel.clienteId]) {
                map[imovel.clienteId] = [];
            }
            map[imovel.clienteId].push(imovel);
        });
        return map;
    }, [imoveis]);

    const filteredAndSortClientes = useMemo(() => {
        let filtered = [...allClientes];

        if (deferredSearchTerm) {
            filtered = filtered.filter(
                (cliente) =>
                    cliente.nome
                        ?.toLowerCase()
                        .includes(deferredSearchTerm.toLowerCase()) ||
                    cliente.email
                        ?.toLowerCase()
                        .includes(deferredSearchTerm.toLowerCase()) ||
                    cliente.telefone?.includes(deferredSearchTerm)
            );
        }

        if (perfilFilter !== "todos") {
            filtered = filtered.filter(
                (cliente) => cliente.perfil === perfilFilter
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
            } else if (sortField === "imoveis") {
                const countA = clientImoveisMap[a.id]?.length || 0;
                const countB = clientImoveisMap[b.id]?.length || 0;
                return sortOrder === "asc" ? countA - countB : countB - countA;
            }
        });
        return filtered;
    }, [allClientes, deferredSearchTerm, perfilFilter, sortField, sortOrder]);

    const canEdit = (cliente) =>
        user?.scope === "ADMIN" ||
        user?.scope === "GERENTE" ||
        cliente.corretorId === user?.sub;

    const paginatedClientes = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredAndSortClientes.slice(start, start + pageSize);
    }, [filteredAndSortClientes, currentPage, pageSize]);

    const pagination = useMemo(
        () => ({
            currentPage,
            totalPages: Math.ceil(filteredAndSortClientes.length / pageSize),
            totalItems: filteredAndSortClientes.length,
            pageSize,
        }),
        [filteredAndSortClientes, currentPage, pageSize]
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
            if (editingCliente) {
                const update = { id: editingCliente.id, ...data };
                await updateCliente(update);
                toast.success("Cliente atualizado com sucesso!");
            } else {
                await createCliente(data);
                toast.success("Cliente criado com sucesso!");
            }
            setShowForm(false);
            setEditingCliente(null);
            reload();
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
            const message =
                error.response?.data?.message ||
                "Erro ao salvar cliente. Tente novamente.";
            toast.error(message);
        }
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setClientToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteCliente(clientToDelete);
            toast.success("Cliente excluído com sucesso!");
            setCurrentPage(0);
            reload();
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            const message =
                error.response?.data?.message ||
                "Erro ao excluir cliente. Tente novamente.";
            toast.error(message);
        } finally {
            setShowDeleteModal(false);
            setClientToDelete(null);
        }
    };

    const handleNewCliente = () => {
        setEditingCliente(null);
        setShowForm(true);
    };

    if (isLoading) {
        return <ClientesSkeleton />;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <ClientesHeader onNewCliente={handleNewCliente} />
                <ClientesFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    perfilFilter={perfilFilter}
                    setPerfilFilter={setPerfilFilter}
                    currentUser={currentUser}
                />
                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredAndSortClientes.length} clientes encontrados
                    </p>
                </div>
                <ClientesTable
                    paginatedClientes={paginatedClientes}
                    pagination={pagination}
                    handlePageChange={handlePageChange}
                    handlePageSizeChange={handlePageSizeChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={canEdit}
                    clientImoveisMap={clientImoveisMap}
                    isLoading={isLoading}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                />
                {showForm && (
                    <ClienteForm
                        cliente={editingCliente}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingCliente(null);
                        }}
                        currentUser={user}
                    />
                )}
                <DeleteConfirmationModal
                    open={showDeleteModal}
                    onOpenChange={setShowDeleteModal}
                    onConfirm={confirmDelete}
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
                    confirmLabel="Excluir"
                    cancelLabel="Cancelar"
                />
            </div>
        </div>
    );
}
