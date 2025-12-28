import { useState, useMemo, useCallback, useEffect } from "react";
import { useDeferredValue } from "react";

/**
 * Hook customizado para gerenciar filtros, busca, ordenação e paginação de corretores.
 * Centraliza a lógica de processamento da lista de corretores.
 */
export const useCorretoresFilters = (allCorretores = []) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState("nome");
    const [sortOrder, setSortOrder] = useState("asc");
    const [perfilFilter, setPerfilFilter] = useState("todos");

    // Usa useDeferredValue para otimizar busca (padrão do React 18+)
    const deferredSearchTerm = useDeferredValue(searchTerm);

    // Filtragem e Ordenação memoizada
    const filteredAndSortCorretores = useMemo(() => {
        let filtered = [...allCorretores];

        // Busca (usa deferred value para não bloquear UI)
        if (deferredSearchTerm) {
            const lower = deferredSearchTerm.toLowerCase();
            filtered = filtered.filter(
                (corretor) =>
                    corretor.nome?.toLowerCase().includes(lower) ||
                    corretor.email?.toLowerCase().includes(lower) ||
                    corretor.telefone?.includes(lower)
            );
        }

        // Filtro por perfil
        if (perfilFilter !== "todos") {
            filtered = filtered.filter((corretor) =>
                corretor.roles?.some((role) => role.nome === perfilFilter)
            );
        }

        // Ordenação
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
            }
            return 0; // Fallback
        });

        return filtered;
    }, [allCorretores, deferredSearchTerm, perfilFilter, sortField, sortOrder]);

    // Reseta a página para 0 sempre que os filtros ou a busca mudam
    useEffect(() => {
        setCurrentPage(0);
    }, [deferredSearchTerm, perfilFilter]);

    // Paginação memoizada
    const paginatedCorretores = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredAndSortCorretores.slice(start, start + pageSize);
    }, [filteredAndSortCorretores, currentPage, pageSize]);

    // Objeto de paginação memoizado
    const pagination = useMemo(
        () => ({
            currentPage,
            totalPages: Math.ceil(filteredAndSortCorretores.length / pageSize) || 1,
            totalItems: filteredAndSortCorretores.length,
            pageSize,
        }),
        [filteredAndSortCorretores.length, currentPage, pageSize]
    );

    // Handlers memoizados com useCallback
    const handleSort = useCallback((field) => {
        setSortField((prevField) => {
            if (prevField === field) {
                setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
            } else {
                setSortOrder("asc");
            }
            return field;
        });
    }, []);

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            setCurrentPage(newPage);
        }
    }, [pagination.totalPages]);

    const handlePageSizeChange = useCallback((newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
    }, []);

    return {
        // Estados e Dados processados
        searchTerm,
        setSearchTerm,
        perfilFilter,
        setPerfilFilter,
        sortField,
        sortOrder,
        filteredAndSortCorretores,
        paginatedCorretores,
        pagination,
        // Handlers
        handleSort,
        handlePageChange,
        handlePageSizeChange,
        // Flag para indicar se a busca está pendente (deferred)
        isSearchPending: searchTerm !== deferredSearchTerm,
    };
};
