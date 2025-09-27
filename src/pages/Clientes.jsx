import React, { useState, useMemo, useEffect, useCallback } from "react";
import ClientesHeader from "@/components/clientes/clientePage/ClientesHeader";
import ClientesSearch from "@/components/clientes/clientePage/ClientesSearch";
import ClientesTable from "@/components/clientes/clienteTable/ClientesTable";
import ClienteForm from "@/components/clientes/clienteForm/ClienteForm";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    const { clientes, imoveis, isLoading, reload } = useClientesData(user);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const applyFilters = useCallback(() => {
        let filtered = [...clientes];

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
    }, [clientes, debouncedSearchTerm]);

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
            toast.error("Erro ao salvar cliente. Tente novamente.");
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
                reload();
            } catch (error) {
                console.error("Erro ao excluir cliente:", error);
                toast.error("Erro ao excluir cliente. Tente novamente.");
            }
        }
    };

    const handleNewCliente = () => {
        setEditingCliente(null);
        setShowForm(true);
    };

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="bg-white rounded-xl shadow-sm border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="h-12 bg-gray-200"></TableHead>
                                    <TableHead className="h-12 bg-gray-200"></TableHead>
                                    <TableHead className="h-12 bg-gray-200"></TableHead>
                                    <TableHead className="h-12 bg-gray-200"></TableHead>
                                    <TableHead className="h-12 bg-gray-200"></TableHead>
                                    <TableHead className="h-12 bg-gray-200"></TableHead>
                                    <TableHead className="h-12 bg-gray-200"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="h-12 bg-gray-200"></TableCell>
                                            <TableCell className="h-12 bg-gray-200"></TableCell>
                                            <TableCell className="h-12 bg-gray-200"></TableCell>
                                            <TableCell className="h-12 bg-gray-200"></TableCell>
                                            <TableCell className="h-12 bg-gray-200"></TableCell>
                                            <TableCell className="h-12 bg-gray-200"></TableCell>
                                            <TableCell className="h-12 bg-gray-200"></TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }

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
                    filteredClientes={filteredClientes}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={canEdit}
                    clientImoveisMap={clientImoveisMap}
                />
            </div>

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
    );
}
