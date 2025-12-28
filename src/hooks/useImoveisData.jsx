import { useState, useEffect, useCallback, useRef } from "react";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { filterDataByScope } from "@/services/DashboardService";
import { toast } from "sonner";

// Cache simples com TTL de 60 segundos
const CACHE_TTL = 60 * 1000;
const cacheRef = { data: null, timestamp: null, userId: null };

export default function useImoveisData(user) {
  const [allImoveis, setAllImoveis] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [corretores, setCorretores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      // Verifica cache
      if (!forceRefresh && cacheRef.data && cacheRef.userId === user?.sub) {
        const now = Date.now();
        if (now - cacheRef.timestamp < CACHE_TTL) {
          setAllImoveis(cacheRef.data.allImoveis);
          setClientes(cacheRef.data.clientes);
          setCorretores(cacheRef.data.corretores);
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
          setAllImoveis([]);
          setClientes([]);
          setCorretores([]);
          return;
        }

        const scope = user.scope;
        const userId = user.sub;

        // Determina quais dados buscar baseado no escopo
        let imoveis = [];
        let clientesData = [];
        let corretoresData = [];

        if (scope === "ADMIN") {
          // ADMIN: busca todos os dados em paralelo
          const [allUsers, allImoveisData, allClientesData] = await Promise.all(
            [
              fetchUsers(signal),
              fetchImoveis({}, signal),
              fetchClientes({}, signal),
            ]
          );

          const filtered = filterDataByScope({
            scope,
            userId,
            allUsers: allUsers || [],
            allImoveis: allImoveisData || [],
            allClientes: allClientesData || [],
          });

          imoveis = filtered.imoveis;
          clientesData = allClientesData || [];
          corretoresData = allUsers || [];
        } else if (scope === "GERENTE") {
          // GERENTE: precisa buscar users primeiro
          const allUsers = await fetchUsers(signal);
          const teamIds = (allUsers || [])
            .filter((u) => u.gerenteId == userId)
            .map((u) => u.userId);

          const [allImoveisData, allClientesData] = await Promise.all([
            fetchImoveis({}, signal),
            fetchClientes({}, signal),
          ]);

          const filtered = filterDataByScope({
            scope,
            userId,
            allUsers: allUsers || [],
            allImoveis: allImoveisData || [],
            allClientes: allClientesData || [],
          });

          imoveis = filtered.imoveis;
          clientesData = filtered.clientes;
          corretoresData = filtered.teamMembers;
        } else if (scope === "CORRETOR") {
          // CORRETOR: busca apenas seus próprios dados
          const [imoveisData, clientesDataResult, allUsers] = await Promise.all(
            [
              fetchImoveis({ corretorId: userId }, signal),
              fetchClientes({ corretorId: userId }, signal),
              fetchUsers(signal),
            ]
          );

          imoveis = imoveisData || [];
          clientesData = clientesDataResult || [];
          corretoresData = allUsers || [];
        } else {
          throw new Error("Escopo de usuário inválido");
        }

        const data = {
          allImoveis: imoveis,
          clientes: clientesData,
          corretores: corretoresData,
        };

        // Atualiza cache
        cacheRef.data = data;
        cacheRef.timestamp = Date.now();
        cacheRef.userId = userId;

        setAllImoveis(imoveis);
        setClientes(clientesData);
        setCorretores(corretoresData);
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
        setAllImoveis([]);
        setClientes([]);
        setCorretores([]);
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
      setAllImoveis([]);
      setClientes([]);
      setCorretores([]);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user, loadData]);

  return {
    allImoveis,
    clientes,
    corretores,
    isLoading,
    error,
    reload: () => loadData(true),
  };
}

/**
 * Limpa o cache de imóveis (útil para forçar refresh após mudanças)
 */
export const clearImoveisCache = () => {
  cacheRef.data = null;
  cacheRef.timestamp = null;
  cacheRef.userId = null;
};
