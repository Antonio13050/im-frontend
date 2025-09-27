import React, { useState, useMemo, useEffect, useCallback } from "react";
import ClientesHeader from "@/components/clientes/clientePage/ClientesHeader";
import ClientesSearch from "@/components/clientes/clientePage/ClientesSearch";
import ClientesTable from "@/components/clientes/clienteTable/ClientesTable";
import ClienteForm from "@/components/clientes/clienteForm/ClienteForm";
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
    const { allClientes, imoveis, isLoading, reload } = useClientesData(user);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const applyFilters = useCallback(() => {
        let filtered = [...allClientes];

        if (debouncedSearchTerm) {
            const lowerSearch = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(
                (cliente) =>
                    cliente.nome?.toLowerCase().includes(lowerSearch) ||
                    cliente.email?.toLowerCase().includes(lowerSearch) ||
                    cliente.telefone?.includes(debouncedSearchTerm)
            );
        }

        setFilteredClientes(filtered);
        setCurrentPage(0);
    }, [allClientes, debouncedSearchTerm]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

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

    const canEdit = useCallback(
        (cliente) =>
            user?.scope === "ADMIN" ||
            user?.scope === "GERENTE" ||
            cliente.corretorId === user?.sub,
        [user]
    );

    const paginatedClientes = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredClientes.slice(start, start + pageSize);
    }, [filteredClientes, currentPage, pageSize]);

    const pagination = useMemo(
        () => ({
            currentPage,
            totalPages: Math.ceil(filteredClientes.length / pageSize),
            totalItems: filteredClientes.length,
            pageSize,
        }),
        [filteredClientes, currentPage, pageSize]
    );

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

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
            try {
                await deleteCliente(id);
                toast.success("Cliente excluído com sucesso!");
                setCurrentPage(0);
                reload();
            } catch (error) {
                console.error("Erro ao excluir cliente:", error);
                const message =
                    error.response?.data?.message ||
                    "Erro ao excluir cliente. Tente novamente.";
                toast.error(message);
            }
        }
    };

    const handleNewCliente = () => {
        setEditingCliente(null);
        setShowForm(true);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <ClientesHeader onNewCliente={handleNewCliente} />
                <ClientesSearch
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredClientes.length} clientes encontrados
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
            </div>
        </div>
    );
}
