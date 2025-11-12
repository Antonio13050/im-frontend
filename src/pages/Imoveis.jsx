import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ImoveisHeader from "@/components/imoveis/imovelPage/ImoveisHeader";
import ImoveisSearchAndFilters from "@/components/imoveis/imovelPage/ImoveisSearchAndFilters";
import ImoveisCardsList from "@/components/imoveis/imovelPage/ImoveisCardsList";
import ImoveisTable from "@/components/imoveis/imovelTable/ImoveisTable";
import ImoveisList from "@/components/imoveis/imovelPage/ImoveisList";
import ImovelMapa from "@/components/imoveis/imovelMapa/ImovelMapa";

import { useAuth } from "@/contexts/AuthContext";
import useImoveisData from "@/hooks/useImoveisData";
import { deleteImovel } from "@/services/ImovelService";

export default function Imoveis() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { allImoveis, clientes, corretores, isLoading, reload } =
        useImoveisData(user);

    // --- Estados principais ---
    const [filteredImoveis, setFilteredImoveis] = useState([]);
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

    // --- Alternância de visualização ---
    const toggleViewMode = (mode) => setViewMode(mode);

    // Persiste o modo de visualização no localStorage
    useEffect(() => {
        const savedMode = localStorage.getItem("viewMode") || "cards";
        setViewMode(savedMode);
    }, []);

    useEffect(() => {
        localStorage.setItem("viewMode", viewMode);
    }, [viewMode]);

    // --- Debounce da busca ---
    useEffect(() => {
        const handler = setTimeout(
            () => setDebouncedSearchTerm(searchTerm),
            300
        );
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // --- Aplicação dos filtros ---
    const applyFilters = useCallback(() => {
        let filtered = [...allImoveis];

        if (debouncedSearchTerm) {
            const lower = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(
                (i) =>
                    i.titulo?.toLowerCase().includes(lower) ||
                    i.endereco?.bairro?.toLowerCase().includes(lower) ||
                    i.endereco?.cidade?.toLowerCase().includes(lower)
            );
        }

        if (filters.status !== "todos")
            filtered = filtered.filter((i) => i.status === filters.status);

        if (filters.tipo !== "todos")
            filtered = filtered.filter((i) => i.tipo === filters.tipo);

        if (filters.precoMin)
            filtered = filtered.filter(
                (i) => i.preco >= parseFloat(filters.precoMin)
            );

        if (filters.precoMax)
            filtered = filtered.filter(
                (i) => i.preco <= parseFloat(filters.precoMax)
            );

        if (filters.bairro)
            filtered = filtered.filter((i) =>
                i.endereco?.bairro
                    ?.toLowerCase()
                    .includes(filters.bairro.toLowerCase())
            );

        setFilteredImoveis(filtered);
        setCurrentPage(0);
    }, [allImoveis, debouncedSearchTerm, filters]);

    useEffect(() => applyFilters(), [applyFilters]);

    // --- Mapeamento rápido de clientes e corretores ---
    const clientesMap = useMemo(
        () => new Map(clientes.map((c) => [c.id, c.nome])),
        [clientes]
    );
    const corretoresMap = useMemo(
        () => new Map(corretores.map((c) => [c.userId, c.nome])),
        [corretores]
    );

    // --- Controle de edição/exclusão ---
    const canEdit = useCallback(
        (imovel) =>
            user?.scope === "ADMIN" ||
            user?.scope === "GERENTE" ||
            imovel.corretorId === user?.sub,
        [user]
    );

    const handleEdit = (imovelId) => navigate(`/imoveis/${imovelId}/editar`);

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

    // --- Paginação ---
    const paginatedImoveis = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredImoveis.slice(start, start + pageSize);
    }, [filteredImoveis, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredImoveis.length / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
    };

    // --- Loading Skeleton ---
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

    // --- Renderização principal ---
    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50                                                         min-h-screen py-6">
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

                {viewMode === "cards" && (
                    <ImoveisCardsList
                        filteredImoveis={paginatedImoveis}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={canEdit}
                        clientesMap={clientesMap}
                        corretoresMap={corretoresMap}
                    />
                )}

                {viewMode === "table" && (
                    <ImoveisTable
                        imoveis={paginatedImoveis}
                        clientesMap={clientesMap}
                        corretoresMap={corretoresMap}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={canEdit}
                    />
                )}

                {viewMode === "list" && (
                    <ImoveisList
                        filteredImoveis={paginatedImoveis}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        canEdit={canEdit}
                        clientesMap={clientesMap}
                        corretoresMap={corretoresMap}
                    />
                )}

                {viewMode === "map" && (
                    <ImovelMapa
                        imoveis={filteredImoveis}
                        isLoading={isLoading}
                    />
                )}

                {/* --- Paginação (não exibe no modo mapa) --- */}
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
