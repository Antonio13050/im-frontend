import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import {
  filterDataByScope,
  calculateDashboardStats,
} from "@/services/DashboardService";
import { toast } from "sonner";

// Cache simples com TTL de 60 segundos para reduzir requisições
// Aumentado de 30s para 60s para melhorar performance
const CACHE_TTL = 60 * 1000; // 60 segundos
const cacheRef = { data: null, timestamp: null, userId: null };

/**
 * Hook customizado para gerenciar dados do Dashboard
 * Centraliza lógica de carregamento, filtragem e cálculo de estatísticas
 * Otimizado para reduzir requisições e dados transferidos
 */
export const useDashboardData = (user) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const loadDashboardData = useCallback(
    async (forceRefresh = false) => {
      // Verifica cache antes de fazer requisições
      if (!forceRefresh && cacheRef.data && cacheRef.userId === user?.sub) {
        const now = Date.now();
        if (now - cacheRef.timestamp < CACHE_TTL) {
          setStats(cacheRef.data);
          setIsLoading(false);
          return;
        }
      }

      // Cancela requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Cria novo AbortController para esta requisição
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      setError(null);

      try {
        if (!user) {
          setError("Usuário não autenticado");
          setIsLoading(false);
          return;
        }

        const scope = user.scope;
        const userId = user.sub;

        // Determina quais dados buscar baseado no escopo
        let imoveis = [];
        let clientes = [];
        let teamMembers = [];

        if (scope === "ADMIN") {
          // ADMIN: busca todos os dados em paralelo
          // Para otimizar, poderia buscar apenas contagens, mas mantendo compatibilidade
          const [allUsers, allImoveis, allClientes] = await Promise.all([
            fetchUsers(signal),
            fetchImoveis({}, signal),
            fetchClientes({}, signal),
          ]);

          const filtered = filterDataByScope({
            scope,
            userId,
            allUsers: allUsers || [],
            allImoveis: allImoveis || [],
            allClientes: allClientes || [],
          });

          imoveis = filtered.imoveis;
          clientes = filtered.clientes;
          teamMembers = filtered.teamMembers;
        } else if (scope === "GERENTE") {
          // GERENTE: precisa buscar users primeiro para identificar equipe
          const allUsers = await fetchUsers(signal);
          const teamIds = (allUsers || [])
            .filter((u) => u.gerenteId == userId)
            .map((u) => u.userId);

          // Busca imóveis e clientes em paralelo
          const [allImoveis, allClientes] = await Promise.all([
            fetchImoveis({}, signal),
            fetchClientes({}, signal),
          ]);

          const filtered = filterDataByScope({
            scope,
            userId,
            allUsers: allUsers || [],
            allImoveis: allImoveis || [],
            allClientes: allClientes || [],
          });

          imoveis = filtered.imoveis;
          clientes = filtered.clientes;
          teamMembers = filtered.teamMembers;
        } else if (scope === "CORRETOR") {
          // CORRETOR: busca apenas seus próprios dados em paralelo
          const [imoveisData, clientesData] = await Promise.all([
            fetchImoveis({ corretorId: userId }, signal),
            fetchClientes({ corretorId: userId }, signal),
          ]);

          imoveis = imoveisData || [];
          clientes = clientesData || [];
          teamMembers = [];
        } else {
          throw new Error("Escopo de usuário inválido");
        }

        // Calcula estatísticas usando o service
        const calculatedStats = calculateDashboardStats({
          imoveis,
          clientes,
          teamSize: teamMembers.length,
          recentLimit: 6, // Apenas 6 itens mais recentes para RecentActivity
        });

        // Adiciona dados completos para gráficos que precisam (PriceRangeChart)
        const optimizedStats = {
          ...calculatedStats,
          // Mantém dados completos apenas para gráficos (não para RecentActivity)
          _fullImoveisForCharts: imoveis,
        };

        // Atualiza cache
        cacheRef.data = optimizedStats;
        cacheRef.timestamp = Date.now();
        cacheRef.userId = userId;

        setStats(optimizedStats);
      } catch (error) {
        // Ignora erros de cancelamento
        if (
          error.name === "AbortError" ||
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED" ||
          error.message?.includes("canceled")
        ) {
          return;
        }

        console.error("Erro ao carregar dados do dashboard:", error);

        if (error.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          toast.error("Sessão expirada. Faça login novamente.");
          navigate("/login");
        } else {
          const errorMessage =
            error.message || "Erro ao carregar os dados do dashboard";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        // Só atualiza loading se não foi cancelado
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [user, navigate]
  );

  // Carrega dados quando o usuário muda
  useEffect(() => {
    if (user) {
      loadDashboardData();
    } else {
      setIsLoading(false);
      setStats(null);
    }

    // Cleanup: cancela requisições ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user, loadDashboardData]);

  // Memoiza estatísticas derivadas para evitar recálculos
  const memoizedStats = useMemo(() => {
    if (!stats) return null;

    return {
      ...stats,
      // Garante que arrays sempre existam
      imoveisData: stats.imoveisData || [],
      clientesData: stats.clientesData || [],
    };
  }, [stats]);

  // Função para forçar refresh (ignora cache)
  const reload = useCallback(() => {
    loadDashboardData(true);
  }, [loadDashboardData]);

  return {
    stats: memoizedStats,
    isLoading,
    error,
    reload,
  };
};

/**
 * Limpa o cache do dashboard (útil para forçar refresh após mudanças)
 */
export const clearDashboardCache = () => {
  cacheRef.data = null;
  cacheRef.timestamp = null;
  cacheRef.userId = null;
};
