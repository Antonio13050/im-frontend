import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUsers } from "@/services/UserService";
import { filterDataByScope } from "@/services/DashboardService";
import { toast } from "sonner";

// Cache simples com TTL de 60 segundos
const CACHE_TTL = 60 * 1000;
const cacheRef = { data: null, timestamp: null, userId: null };

export const useFetchUsers = (user) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const loadData = useCallback(
        async (forceRefresh = false) => {
            // Verifica cache
            if (!forceRefresh && cacheRef.data && cacheRef.userId === user?.sub) {
                const now = Date.now();
                if (now - cacheRef.timestamp < CACHE_TTL) {
                    setAllUsers(cacheRef.data.allUsers);
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
                    setAllUsers([]);
                    return;
                }

                const scope = user.scope;
                const userId = user.sub;

                const fetchedUsers = await fetchUsers(signal);

                let usersToSet = [];
                if (scope === "ADMIN") {
                    usersToSet = fetchedUsers || [];
                } else {
                    const filtered = filterDataByScope({
                        scope,
                        userId,
                        allUsers: fetchedUsers || [],
                    });
                    usersToSet = filtered.teamMembers; // filterDataByScope retorna teamMembers para usuários
                }

                const data = {
                    allUsers: usersToSet,
                };

                // Atualiza cache
                cacheRef.data = data;
                cacheRef.timestamp = Date.now();
                cacheRef.userId = userId;

                setAllUsers(usersToSet);
            } catch (err) {
                // Ignora erros de cancelamento
                if (
                    err.name === "AbortError" ||
                    err.name === "CanceledError" ||
                    err.code === "ERR_CANCELED"
                ) {
                    return;
                }

                console.error("Erro ao carregar usuários:", err);
                setError(err.message || "Erro ao carregar usuários");
                setAllUsers([]);
                toast.error(`Erro ao carregar usuários: ${err.message}`);
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
            setAllUsers([]);
            setError(null);
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [user, loadData]);

    return { allUsers, isLoading, error, reload: () => loadData(true) };
};

/**
 * Limpa o cache de usuários (útil para forçar refresh após mudanças)
 */
export const clearUsersCache = () => {
    cacheRef.data = null;
    cacheRef.timestamp = null;
    cacheRef.userId = null;
};
