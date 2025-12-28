import { useState, useMemo, useCallback, useEffect } from "react";
import { useDeferredValue } from "react";

/**
 * Hook customizado para gerenciar filtros e busca de imóveis
 * Centraliza lógica de filtragem, busca e paginação
 */
export const useImoveisFilters = (allImoveis = []) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: "todos",
        tipo: "todos",
        precoMin: "",
        precoMax: "",
        bairro: "",
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Usa useDeferredValue para otimizar busca (padrão do React 18+)
    const deferredSearchTerm = useDeferredValue(searchTerm);

    // Filtragem memoizada - calcula apenas quando necessário
    const filteredImoveis = useMemo(() => {
        let filtered = [...allImoveis];

        // Busca (usa deferred value para não bloquear UI)
        if (deferredSearchTerm) {
            const lower = deferredSearchTerm.toLowerCase();
            filtered = filtered.filter(
                (i) =>
                    i.titulo?.toLowerCase().includes(lower) ||
                    i.endereco?.bairro?.toLowerCase().includes(lower) ||
                    i.endereco?.cidade?.toLowerCase().includes(lower)
            );
        }

        // Filtros
        if (filters.status !== "todos") {
            filtered = filtered.filter((i) => i.status === filters.status);
        }

        if (filters.tipo !== "todos") {
            filtered = filtered.filter((i) => i.tipo === filters.tipo);
        }

        if (filters.precoMin) {
            const minPrice = parseFloat(filters.precoMin);
            if (!isNaN(minPrice)) {
                filtered = filtered.filter((i) => (i.preco || 0) >= minPrice);
            }
        }

        if (filters.precoMax) {
            const maxPrice = parseFloat(filters.precoMax);
            if (!isNaN(maxPrice)) {
                filtered = filtered.filter((i) => (i.preco || 0) <= maxPrice);
            }
        }

        if (filters.bairro) {
            const bairroLower = filters.bairro.toLowerCase();
            filtered = filtered.filter((i) =>
                i.endereco?.bairro?.toLowerCase().includes(bairroLower)
            );
        }

        return filtered;
    }, [allImoveis, deferredSearchTerm, filters]);

    // Reseta página quando filtros mudam
    useEffect(() => {
        setCurrentPage(0);
    }, [filters, deferredSearchTerm]);

    // Paginação memoizada
    const paginatedImoveis = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredImoveis.slice(start, start + pageSize);
    }, [filteredImoveis, currentPage, pageSize]);

    const pagination = useMemo(
        () => ({
            currentPage,
            totalPages: Math.ceil(filteredImoveis.length / pageSize) || 1,
            totalItems: filteredImoveis.length,
            pageSize,
        }),
        [filteredImoveis.length, currentPage, pageSize]
    );

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            setCurrentPage(newPage);
        }
    }, [pagination.totalPages]);

    const handlePageSizeChange = useCallback((newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
    }, []);

    const updateFilters = useCallback((updates) => {
        setFilters((prev) => ({ ...prev, ...updates }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            status: "todos",
            tipo: "todos",
            precoMin: "",
            precoMax: "",
            bairro: "",
        });
        setSearchTerm("");
        setCurrentPage(0);
    }, []);

    return {
        // Estados
        searchTerm,
        filters,
        filteredImoveis,
        paginatedImoveis,
        pagination,
        // Ações
        setSearchTerm,
        updateFilters,
        resetFilters,
        handlePageChange,
        handlePageSizeChange,
        // Flag para indicar se está processando busca (deferred)
        isSearchPending: searchTerm !== deferredSearchTerm,
    };
};

