import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table2 } from "lucide-react";
import ImoveisHeader from "@/components/imoveis/imovelPage/ImoveisHeader";
import ImoveisSearchAndFilters from "@/components/imoveis/imovelPage/ImoveisSearchAndFilters";
import ImoveisCardsList from "@/components/imoveis/imovelPage/ImoveisCardsList";
import ImovelForm from "@/components/imoveis/imovelForm/ImovelForm";
import ImoveisTable from "@/components/imoveis/imovelTable/ImoveisTable";
import Mapa from "@/pages/Mapa";
import { useAuth } from "@/contexts/AuthContext";
import useImoveisData from "@/hooks/useImoveisData";
import {
    createImovel,
    updateImovel,
    deleteImovel,
} from "@/services/ImovelService";
import { toast } from "sonner";
import ImovelMapa from "@/components/imoveis/imovelMapa/ImovelMapa";
import ImoveisList from "@/components/imoveis/imovelPage/ImoveisList";

export default function Imoveis() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { allImoveis, clientes, corretores, isLoading, reload } =
        useImoveisData(user);

    const [filteredImoveis, setFilteredImoveis] = useState([]);
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

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [viewMode, setViewMode] = useState("cards");

    console.log("isLoading:", isLoading);

    const toggleViewMode = (mode) => setViewMode(mode);

    useEffect(() => {
        const savedMode = localStorage.getItem("viewMode") || "cards";
        setViewMode(savedMode);
    }, []);

    useEffect(() => {
        localStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    useEffect(() => {
        const handler = setTimeout(
            () => setDebouncedSearchTerm(searchTerm),
            300
        );
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

        if (filters.status !== "todos")
            filtered = filtered.filter(
                (imovel) => imovel.status === filters.status
            );
        if (filters.tipo !== "todos")
            filtered = filtered.filter(
                (imovel) => imovel.tipo === filters.tipo
            );
        if (filters.precoMin)
            filtered = filtered.filter(
                (imovel) => imovel.preco >= parseFloat(filters.precoMin)
            );
        if (filters.precoMax)
            filtered = filtered.filter(
                (imovel) => imovel.preco <= parseFloat(filters.precoMax)
            );
        if (filters.bairro)
            filtered = filtered.filter((imovel) =>
                imovel.endereco?.bairro
                    ?.toLowerCase()
                    .includes(filters.bairro.toLowerCase())
            );

        setFilteredImoveis(filtered);
        setCurrentPage(0);
    }, [allImoveis, debouncedSearchTerm, filters]);

    useEffect(() => applyFilters(), [applyFilters]);

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

    const handleEdit = (imovelId) => {
        navigate(`/imoveis/${imovelId}/editar`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
            try {
                await deleteImovel(id);
                toast.success("Imóvel excluído com sucesso!");
                reload();
            } catch (error) {
                toast.error(`Erro ao excluir imóvel: ${error.message}`);
            }
        }
    };

    const paginatedImoveis = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredImoveis.slice(start, start + pageSize);
    }, [filteredImoveis, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredImoveis.length / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
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
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
            <div className="max-w-[1800px] 2xl:max-w-none mx-auto space-y-8">
                <ImoveisHeader
                    viewMode={viewMode}
                    onToggleViewMode={toggleViewMode}
                />
                <ImoveisSearchAndFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <p className="text-gray-600 text-sm mb-4">
                    {filteredImoveis.length} imóveis encontrados
                </p>

                {viewMode === "cards" ? (
                    <ImoveisCardsList
                        filteredImoveis={paginatedImoveis}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={canEdit}
                        clientesMap={clientesMap}
                        corretoresMap={corretoresMap}
                    />
                ) : viewMode === "table" ? (
                    <ImoveisTable
                        imoveis={paginatedImoveis}
                        clientesMap={clientesMap}
                        corretoresMap={corretoresMap}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={canEdit}
                    />
                ) : viewMode === "list" ? (
                    <ImoveisList
                        filteredImoveis={paginatedImoveis}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={canEdit}
                        clientesMap={clientesMap}
                        corretoresMap={corretoresMap}
                    />
                ) : (
                    <ImovelMapa
                        imoveis={filteredImoveis}
                        isLoading={isLoading}
                    />
                )}

                {/* Paginação visual */}
                {/* Paginação só aparece se NÃO estiver no modo mapa */}
                {viewMode !== "map" && (
                    <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>
                                Página {currentPage + 1} de {totalPages || 1}
                            </span>
                            <span>•</span>
                            <span>{filteredImoveis.length} imóveis</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 0}
                                className="px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage >= totalPages - 1}
                                className="px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            >
                                Próxima
                            </button>

                            <select
                                value={pageSize}
                                onChange={(e) =>
                                    handlePageSizeChange(Number(e.target.value))
                                }
                                className="ml-2 border rounded-lg text-sm px-2 py-1"
                            >
                                {[10, 15, 20, 30].map((size) => (
                                    <option key={size} value={size}>
                                        {size} por página
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
