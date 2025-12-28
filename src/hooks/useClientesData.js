import { useState, useEffect, useCallback, useRef } from "react";
import { fetchClientes } from "@/services/ClienteService";
import { fetchImoveis } from "@/services/ImovelService";
import { toast } from "sonner";
import { filterDataByScope } from "@/services/DashboardService"; // Importar filterDataByScope

// Cache simples com TTL de 60 segundos
const CACHE_TTL = 60 * 1000;
const cacheRef = { data: null, timestamp: null, userId: null };

export default function useClientesData(user) {
    const [allClientes, setAllClientes] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const loadData = useCallback(
        async (forceRefresh = false) => {
            // Verifica cache
            if (!forceRefresh && cacheRef.data && cacheRef.userId === user?.sub) {
                const now = Date.now();
                if (now - cacheRef.timestamp < CACHE_TTL) {
                    setAllClientes(cacheRef.data.allClientes);
                    setImoveis(cacheRef.data.imoveis);
                    setIsLoading(false);
                    return;
                }
            }

            // Cancela requisição anterior
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            setIsLoading(true);
            setError(null);

            try {
                if (!user) {
                    setIsLoading(false);
                    setAllClientes([]);
                    setImoveis([]);
                    return;
                }

                const scope = user.scope;
                const userId = user.sub;

                let clientesData = [];
                let imoveisData = [];

                // ADMIN e GERENTE precisam buscar todos os clientes e imóveis
                // CORRETOR busca apenas os seus próprios
                if (scope === "ADMIN" || scope === "GERENTE") {
                    const [fetchedClientes, fetchedImoveis] = await Promise.all([
                        fetchClientes({}, signal),
                        fetchImoveis({}, signal),
                    ]);

                    const filtered = filterDataByScope({
                        scope,
                        userId,
                        allImoveis: fetchedImoveis || [],
                        allClientes: fetchedClientes || [],
                        // Para clientes, não precisamos de allUsers aqui a princípio
                        // Se no futuro houver filtros mais complexos que dependam de usuários, adicionar fetchUsers
                    });
                    clientesData = filtered.clientes;
                    imoveisData = filtered.imoveis; // Imóveis filtrados pelo escopo do usuário
                } else if (scope === "CORRETOR") {
                    const [fetchedClientes, fetchedImoveis] = await Promise.all([
                        fetchClientes({ corretorId: userId }, signal),
                        fetchImoveis({ corretorId: userId }, signal),
                    ]);
                    clientesData = fetchedClientes || [];
                    imoveisData = fetchedImoveis || [];
                } else {
                    throw new Error("Escopo de usuário inválido");
                }

                const data = {
                    allClientes: clientesData,
                    imoveis: imoveisData,
                };

                // Atualiza cache
                cacheRef.data = data;
                cacheRef.timestamp = Date.now();
                cacheRef.userId = userId;

                setAllClientes(clientesData);
                setImoveis(imoveisData);
            } catch (error) {
                // Ignora erros de cancelamento
                if (
                    error.name === "AbortError" ||
                    error.name === "CanceledError" ||
                    error.code === "ERR_CANCELED"
                ) {
                    return;
                }

                console.error("Erro ao carregar dados:", error);
                setError(error.message || "Erro ao carregar dados");
                setAllClientes([]);
                setImoveis([]);
                toast.error(`Erro ao carregar dados: ${error.message}`);
            } finally {
                if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        },
        [user]
    );

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setIsLoading(false);
            setAllClientes([]);
            setImoveis([]);
            setError(null);
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [user, loadData]);

    return {
        allClientes,
        imoveis,
        isLoading,
        error,
        reload: () => loadData(true),
    };
}

/**
 * Limpa o cache de clientes (útil para forçar refresh após mudanças)
 */
export const clearClientesCache = () => {
    cacheRef.data = null;
    cacheRef.timestamp = null;
    cacheRef.userId = null;
};
