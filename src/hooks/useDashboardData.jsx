import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryKeys } from '@/lib/queryKeys';
import { fetchImoveis } from '@/services/ImovelService';
import { fetchClientes } from '@/services/ClienteService';
import { fetchUsers } from '@/services/UserService';
import {
  filterDataByScope,
  calculateDashboardStats,
} from '@/services/DashboardService';
import { toast } from 'sonner';

/**
 * Fetches dashboard data based on user scope
 */
async function fetchDashboardData(user) {
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const scope = user.scope;
  const userId = user.sub;

  let imoveis = [];
  let clientes = [];
  let teamMembers = [];

  if (scope === 'ADMIN') {
    const [allUsers, allImoveis, allClientes] = await Promise.all([
      fetchUsers(),
      fetchImoveis(),
      fetchClientes(),
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
  } else if (scope === 'GERENTE') {
    const allUsers = await fetchUsers();

    const [allImoveis, allClientes] = await Promise.all([
      fetchImoveis(),
      fetchClientes(),
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
  } else if (scope === 'CORRETOR') {
    const [imoveisData, clientesData] = await Promise.all([
      fetchImoveis({ corretorId: userId }),
      fetchClientes({ corretorId: userId }),
    ]);

    imoveis = imoveisData || [];
    clientes = clientesData || [];
    teamMembers = [];
  } else {
    throw new Error('Escopo de usuário inválido');
  }

  const calculatedStats = calculateDashboardStats({
    imoveis,
    clientes,
    teamSize: teamMembers.length,
    recentLimit: 6,
  });

  return {
    ...calculatedStats,
    _fullImoveisForCharts: imoveis,
  };
}

/**
 * Hook to fetch dashboard data with React Query
 */
export const useDashboardData = (user) => {
  const navigate = useNavigate();

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.dashboard.data(user?.sub, user?.scope),
    queryFn: () => fetchDashboardData(user),
    enabled: !!user,
    meta: {
      onError: (error) => {
        if (error.response?.status === 401) {
          toast.error('Sessão expirada. Faça login novamente.');
          navigate('/login');
        }
      },
    },
  });

  const memoizedStats = useMemo(() => {
    if (!stats) return null;

    return {
      ...stats,
      imoveisData: stats.imoveisData || [],
      clientesData: stats.clientesData || [],
    };
  }, [stats]);

  return {
    stats: memoizedStats,
    isLoading,
    error: error?.message || null,
    reload: () => refetch(),
  };
};

/**
 * Hook to invalidate dashboard cache
 */
export function useInvalidateDashboard() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };
}

export default useDashboardData;
