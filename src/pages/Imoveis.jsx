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
import { Plus, Search, Filter } from "lucide-react";

import ImovelCard from "../components/imoveis/ImovelCard";
import ImovelForm from "../components/imoveis/ImovelForm";
import ImovelFilters from "../components/imoveis/ImovelFilters";

import {
    fetchImoveis,
    createImovel,
    updateImovel,
    deleteImovel,
} from "@/api/ImovelApi";
import { fetchClientes } from "@/services/ClienteService";
import { toast } from "sonner";

export default function Imoveis() {
    const [imoveis, setImoveis] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [filteredImoveis, setFilteredImoveis] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingImovel, setEditingImovel] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "todos",
        tipo: "todos",
        precoMin: "",
        precoMax: "",
        bairro: "",
    });

    const applyFilters = useCallback(() => {
        let filtered = [...imoveis];

        if (searchTerm) {
            filtered = filtered.filter(
                (imovel) =>
                    imovel.titulo
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    imovel.endereco?.bairro
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    imovel.endereco?.cidade
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (filters.status !== "todos") {
            filtered = filtered.filter(
                (imovel) => imovel.status === filters.status
            );
        }

        if (filters.tipo !== "todos") {
            filtered = filtered.filter(
                (imovel) => imovel.tipo === filters.tipo
            );
        }

        if (filters.precoMin) {
            filtered = filtered.filter(
                (imovel) => imovel.preco >= parseFloat(filters.precoMin)
            );
        }

        if (filters.precoMax) {
            filtered = filtered.filter(
                (imovel) => imovel.preco <= parseFloat(filters.precoMax)
            );
        }

        if (filters.bairro) {
            filtered = filtered.filter((imovel) =>
                imovel.endereco?.bairro
                    ?.toLowerCase()
                    .includes(filters.bairro.toLowerCase())
            );
        }

        setFilteredImoveis(filtered);
    }, [imoveis, searchTerm, filters]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [imoveisData, clientesData] = await Promise.all([
                fetchImoveis(),
                fetchClientes(),
            ]);
            setImoveis(imoveisData);
            setClientes(clientesData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            toast.error(
                error.response?.data ||
                    "Erro ao carregar dados. Tente novamente."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingImovel) {
                // For updates, ensure the id is included in the imovel JSON
                const imovelJson = JSON.parse(
                    await formData.get("imovel").text()
                );
                imovelJson.id = editingImovel.id;
                const updatedFormData = new FormData();
                updatedFormData.append(
                    "imovel",
                    new Blob([JSON.stringify(imovelJson)], {
                        type: "application/json",
                    })
                );
                for (let [key, value] of formData.entries()) {
                    if (key === "fotos") {
                        updatedFormData.append("fotos", value);
                    }
                }
                await updateImovel(updatedFormData);
                toast.success("Imóvel atualizado com sucesso!");
            } else {
                await createImovel(formData);
                toast.success("Imóvel criado com sucesso!");
            }
            setShowForm(false);
            setEditingImovel(null);
            loadData();
        } catch (error) {
            console.error("Erro ao salvar imóvel:", error);
            toast.error(
                error.response?.data ||
                    "Erro ao salvar imóvel. Tente novamente."
            );
        }
    };

    const handleEdit = (imovel) => {
        setEditingImovel(imovel);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
            try {
                await deleteImovel(id);
                toast.success("Imóvel excluído com sucesso!");
                loadData();
            } catch (error) {
                console.error("Erro ao excluir imóvel:", error);
                toast.error(
                    error.response?.data ||
                        "Erro ao excluir imóvel. Tente novamente."
                );
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
                                    className="h-64 bg-gray-200 rounded-lg"
                                ></div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }

    const clientesMap = new Map(clientes.map((c) => [c.id, c.nome]));

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Imóveis
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gerencie seu portfólio de imóveis
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Imóvel
                    </Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar imóveis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <ImovelFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                    />
                </div>

                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredImoveis.length} imóveis encontrados
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImoveis.map((imovel) => (
                        <ImovelCard
                            key={imovel.id}
                            imovel={imovel}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            canEdit={
                                user?.perfil === "admin" ||
                                imovel.corretor_id === user?.id
                            }
                            clienteNome={
                                imovel.clienteId
                                    ? clientesMap.get(imovel.clienteId)
                                    : null
                            }
                        />
                    ))}
                </div>

                {filteredImoveis.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum imóvel encontrado
                        </h3>
                        <p className="text-gray-500">
                            Tente ajustar os filtros de busca ou adicione um
                            novo imóvel
                        </p>
                    </div>
                )}
            </div>

            {showForm && (
                <ImovelForm
                    imovel={editingImovel}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingImovel(null);
                    }}
                />
            )}
        </div>
    );
}
