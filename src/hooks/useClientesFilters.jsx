import { useState, useMemo, useCallback, useEffect } from "react";
import { useDeferredValue } from "react";

/**
 * Hook customizado para gerenciar filtros, busca, ordenação e paginação de clientes.
 * Centraliza a lógica de processamento da lista de clientes.
 */
export const useClientesFilters = (allClientes = [], clientImoveisMap = {}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState("nome");
    const [sortOrder, setSortOrder] = useState("asc");
    const [perfilFilter, setPerfilFilter] = useState("todos");

    // Usa useDeferredValue para otimizar busca (padrão do React 18+)
    const deferredSearchTerm = useDeferredValue(searchTerm);

    // Filtragem e Ordenação memoizada
    const filteredAndSortClientes = useMemo(() => {
        let filtered = [...allClientes];

        // Busca (usa deferred value para não bloquear UI)
        if (deferredSearchTerm) {
            const lower = deferredSearchTerm.toLowerCase();
            filtered = filtered.filter(
                (cliente) =>
                    cliente.nome?.toLowerCase().includes(lower) ||
                    cliente.email?.toLowerCase().includes(lower) ||
                    cliente.telefone?.includes(lower)
            );
        }

        // Filtro por perfil
        if (perfilFilter !== "todos") {
            filtered = filtered.filter(
                (cliente) => cliente.perfil === perfilFilter
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
            } else if (sortField === "imoveis") {
                const countA = clientImoveisMap[a.id]?.length || 0;
                const countB = clientImoveisMap[b.id]?.length || 0;
                return sortOrder === "asc" ? countA - countB : countB - countA;
            }
            return 0; // Fallback
        });
        return filtered;
    }, [allClientes, deferredSearchTerm, perfilFilter, sortField, sortOrder, clientImoveisMap]);

    // Reseta a página para 0 sempre que os filtros ou a busca mudam
    useEffect(() => {
        setCurrentPage(0);
    }, [deferredSearchTerm, perfilFilter]);

    // Paginação memoizada
    const paginatedClientes = useMemo(() => {
        const start = currentPage * pageSize;
        return filteredAndSortClientes.slice(start, start + pageSize);
    }, [filteredAndSortClientes, currentPage, pageSize]);

    // Objeto de paginação memoizado
    const pagination = useMemo(
        () => ({
            currentPage,
            totalPages: Math.ceil(filteredAndSortClientes.length / pageSize) || 1,
            totalItems: filteredAndSortClientes.length,
            pageSize,
        }),
        [filteredAndSortClientes.length, currentPage, pageSize]
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
        filteredAndSortClientes,
        paginatedClientes,
        pagination,
        // Handlers
        handleSort,
        handlePageChange,
        handlePageSizeChange,
        // Flag para indicar se a busca está pendente (deferred)
        isSearchPending: searchTerm !== deferredSearchTerm,
    };
};
