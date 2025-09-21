import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users as UsersIcon } from "lucide-react";

import ClienteCard from "../components/clientes/ClienteCard";
import ClienteForm from "../components/clientes/ClienteForm";
import {
    createCliente,
    deleteCliente,
    fetchClientes,
    updateCliente,
} from "@/services/ClienteService";
import { fetchImoveis } from "@/services/ImovelService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const applyFilters = useCallback(() => {
        let filtered = [...clientes];

        if (searchTerm) {
            filtered = filtered.filter(
                (cliente) =>
                    cliente.nome
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    cliente.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    cliente.telefone?.includes(searchTerm)
            );
        }

        setFilteredClientes(filtered);
    }, [clientes, searchTerm]);

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

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setIsLoading(false);
            setImoveis([]);
            setClientes([]);
        }
    }, [user]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [clientesData, imoveisData] = await Promise.all([
                fetchClientes(),
                fetchImoveis(),
            ]);
            setClientes(clientesData ?? []);
            setImoveis(imoveisData ?? []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setClientes([]);
            setImoveis([]);
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
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
            loadData();
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
                loadData();
            } catch (error) {
                console.error("Erro ao excluir cliente:", error);
                toast.error("Erro ao excluir cliente. Tente novamente.");
            }
        }
    };

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
                            Clientes
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie seus leads e clientes
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Cliente
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar clientes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredClientes.length} clientes encontrados
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClientes.map((cliente) => (
                        <ClienteCard
                            key={cliente.id}
                            cliente={cliente}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={
                                user?.scope === "ADMIN" ||
                                user?.scope === "GERENTE" ||
                                cliente.corretorId == user?.sub
                            }
                            imoveisVinculados={
                                clientImoveisMap[cliente.id] || []
                            }
                        />
                    ))}
                </div>

                {filteredClientes.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UsersIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum cliente encontrado
                        </h3>
                        <p className="text-gray-500">
                            Tente ajustar a busca ou adicione um novo cliente
                        </p>
                    </div>
                )}
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
