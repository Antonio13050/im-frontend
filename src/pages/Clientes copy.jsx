import React, { useState, useEffect, useCallback } from "react";
import { Cliente } from "@/entities/Cliente";
import { User } from "@/entities/User";
import { Imovel } from "@/entities/Imovel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users as UsersIcon } from "lucide-react";

import ClienteCard from "../components/clientes/ClienteCard";
import ClienteForm from "../components/clientes/ClienteForm";

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [user, setUser] = useState(null);
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

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const loadData = async () => {
        try {
            const userData = await User.me();
            setUser(userData);

            const clientesPromise =
                userData.perfil === "admin"
                    ? Cliente.list("-created_date")
                    : Cliente.filter(
                          { corretor_id: userData.id },
                          "-created_date"
                      );

            const imoveisPromise = Imovel.list();

            const [clientesData, imoveisData] = await Promise.all([
                clientesPromise,
                imoveisPromise,
            ]);

            setClientes(clientesData);
            setImoveis(imoveisData);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
        }
        setIsLoading(false);
    };

    const handleSave = async (data) => {
        try {
            if (editingCliente) {
                await Cliente.update(editingCliente.id, data);
            } else {
                await Cliente.create({ ...data, corretor_id: user.id });
            }
            setShowForm(false);
            setEditingCliente(null);
            loadData();
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
        }
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
            try {
                await Cliente.delete(id);
                loadData();
            } catch (error) {
                console.error("Erro ao excluir cliente:", error);
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

                {/* Search */}
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

                {/* Results */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredClientes.length} clientes encontrados
                    </p>
                </div>

                {/* Clientes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClientes.map((cliente) => {
                        const imoveisVinculados = imoveis.filter(
                            (imovel) => imovel.cliente_id === cliente.id
                        );
                        return (
                            <ClienteCard
                                key={cliente.id}
                                cliente={cliente}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                canEdit={
                                    user?.perfil === "admin" ||
                                    cliente.corretor_id === user?.id
                                }
                                imoveisVinculados={imoveisVinculados}
                            />
                        );
                    })}
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
                />
            )}
        </div>
    );
}
