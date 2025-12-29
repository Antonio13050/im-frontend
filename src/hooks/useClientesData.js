import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { fetchClientes } from '@/services/ClienteService';
import { fetchImoveis } from '@/services/ImovelService';
import { filterDataByScope } from '@/services/DashboardService';

/**
 * Fetches clientes data based on user scope
 */
async function fetchClientesWithScope(user) {
    if (!user) return { clientes: [], imoveis: [] };

    const scope = user.scope;
    const userId = user.sub;

    if (scope === 'ADMIN' || scope === 'GERENTE') {
        const [clientesData, imoveisData] = await Promise.all([
            fetchClientes(),
            fetchImoveis(),
        ]);

        const filtered = filterDataByScope({
            scope,
            userId,
            allImoveis: imoveisData || [],
            allClientes: clientesData || [],
        });

        return {
            clientes: filtered.clientes,
            imoveis: filtered.imoveis,
        };
    } else if (scope === 'CORRETOR') {
        const [clientesData, imoveisData] = await Promise.all([
            fetchClientes({ corretorId: userId }),
            fetchImoveis({ corretorId: userId }),
        ]);

        return {
            clientes: clientesData || [],
            imoveis: imoveisData || [],
        };
    }

    return { clientes: [], imoveis: [] };
}

/**
 * Hook to fetch clientes data with React Query
 * Replaces the manual cache implementation
 */
export default function useClientesData(user) {
    const queryClient = useQueryClient();

    const queryKey = user?.scope === 'CORRETOR'
        ? queryKeys.clientes.byCorretor(user.sub)
        : queryKeys.clientes.all;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [...queryKey, 'withImoveis'],
        queryFn: () => fetchClientesWithScope(user),
        enabled: !!user,
    });

    return {
        allClientes: data?.clientes ?? [],
        imoveis: data?.imoveis ?? [],
        isLoading,
        error: error?.message || null,
        reload: () => refetch(),
    };
}

/**
 * Hook to invalidate clientes cache
 * Use after mutations (create, update, delete)
 */
export function useInvalidateClientes() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.clientes.all });
    };
}
