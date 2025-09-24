import React, { useState, useMemo, useEffect, useCallback } from "react";
import ImoveisHeader from "@/components/imoveis/imovelPage/ImoveisHeader";
import ImoveisSearchAndFilters from "@/components/imoveis/imovelPage/ImoveisSearchAndFilters";
import ImoveisList from "@/components/imoveis/imovelPage/ImoveisList";
import ImovelForm from "@/components/imoveis/imovelForm/ImovelForm";
import { useAuth } from "@/contexts/AuthContext";
import useImoveisData from "@/hooks/useImoveisData";
import {
    createImovel,
    updateImovel,
    deleteImovel,
} from "@/services/ImovelService";
import { toast } from "sonner";

export default function Imoveis() {
    const { user } = useAuth();
    const { allImoveis, clientes, corretores, isLoading, reload } =
        useImoveisData(user);
    const [filteredImoveis, setFilteredImoveis] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingImovel, setEditingImovel] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "todos",
        tipo: "todos",
        precoMin: "",
        precoMax: "",
        bairro: "",
    });

    // Debounce manual simples para searchTerm
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const applyFilters = useCallback(() => {
        let filtered = [...allImoveis];

        if (debouncedSearchTerm) {
            const lowerSearch = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(
                (imovel) =>
                    imovel.titulo?.toLowerCase().includes(lowerSearch) ||
                    imovel.endereco?.bairro
                        ?.toLowerCase()
                        .includes(lowerSearch) ||
                    imovel.endereco?.cidade?.toLowerCase().includes(lowerSearch)
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
    }, [allImoveis, debouncedSearchTerm, filters]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const clientesMap = useMemo(
        () => new Map(clientes.map((c) => [c.id, c.nome])),
        [clientes]
    );
    const corretoresMap = useMemo(
        () => new Map(corretores.map((c) => [c.userId, c.nome])),
        [corretores]
    );

    const canEdit = useCallback(
        (imovel) =>
            user?.scope === "ADMIN" ||
            user?.scope === "GERENTE" ||
            imovel.corretorId === user?.sub,
        [user]
    );

    const handleSave = async (formData) => {
        try {
            if (editingImovel) {
                await updateImovel(formData, editingImovel.id);
                toast.success("Imóvel atualizado com sucesso!");
            } else {
                await createImovel(formData);
                toast.success("Imóvel criado com sucesso!");
            }
            setShowForm(false);
            setEditingImovel(null);
            reload();
        } catch (error) {
            console.error("Erro ao salvar imóvel:", error);
            toast.error(
                `Erro ao salvar imóvel: ${
                    error.response?.data?.message || error.message
                }`
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
                reload();
            } catch (error) {
                console.error("Erro ao excluir imóvel:", error);
                toast.error(`Erro ao excluir imóvel: ${error.message}`);
            }
        }
    };

    const handleNewImovel = () => {
        setEditingImovel(null);
        setShowForm(true);
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

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <ImoveisHeader onNewImovel={handleNewImovel} />
                <ImoveisSearchAndFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filters={filters}
                    onFiltersChange={setFilters}
                />
                <div className="mb-4">
                    <p className="text-gray-600">
                        {filteredImoveis.length} imóveis encontrados
                    </p>
                </div>
                <ImoveisList
                    filteredImoveis={filteredImoveis}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    canEdit={canEdit}
                    clientesMap={clientesMap}
                    corretoresMap={corretoresMap}
                />
            </div>

            {showForm && (
                <ImovelForm
                    imovel={editingImovel}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingImovel(null);
                    }}
                    currentUser={user}
                    corretores={corretores}
                />
            )}
        </div>
    );
}
