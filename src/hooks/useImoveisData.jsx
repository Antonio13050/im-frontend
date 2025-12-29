import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { fetchImoveis } from '@/services/ImovelService';
import { fetchClientes } from '@/services/ClienteService';
import { fetchUsers } from '@/services/UserService';
import { filterDataByScope } from '@/services/DashboardService';

/**
 * Fetches imoveis data based on user scope
 */
async function fetchImoveisWithScope(user) {
  if (!user) return { imoveis: [], clientes: [], corretores: [] };

  const scope = user.scope;
  const userId = user.sub;

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

    return {
      imoveis: filtered.imoveis,
      clientes: allClientes || [],
      corretores: allUsers || [],
    };
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

    return {
      imoveis: filtered.imoveis,
      clientes: filtered.clientes,
      corretores: filtered.teamMembers,
    };
  } else if (scope === 'CORRETOR') {
    const [imoveisData, clientesData, allUsers] = await Promise.all([
      fetchImoveis({ corretorId: userId }),
      fetchClientes({ corretorId: userId }),
      fetchUsers(),
    ]);

    return {
      imoveis: imoveisData || [],
      clientes: clientesData || [],
      corretores: allUsers || [],
    };
  }

  return { imoveis: [], clientes: [], corretores: [] };
}

/**
 * Hook to fetch imoveis data with React Query
 */
export default function useImoveisData(user) {
  const queryKey = user?.scope === 'CORRETOR'
    ? queryKeys.imoveis.byCorretor(user.sub)
    : queryKeys.imoveis.all;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...queryKey, 'withRelations'],
    queryFn: () => fetchImoveisWithScope(user),
    enabled: !!user,
  });

  return {
    allImoveis: data?.imoveis ?? [],
    clientes: data?.clientes ?? [],
    corretores: data?.corretores ?? [],
    isLoading,
    error: error?.message || null,
    reload: () => refetch(),
  };
}

/**
 * Hook to invalidate imoveis cache
 */
export function useInvalidateImoveis() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.imoveis.all });
  };
}
