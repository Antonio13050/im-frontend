import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { fetchProcessos } from '@/services/ProcessoService';
import { fetchImoveis } from '@/services/ImovelService';
import { fetchClientes } from '@/services/ClienteService';
import { fetchUsers } from '@/services/UserService';

/**
 * Fetches all processos related data
 */
async function fetchProcessosData() {
    const [processos, imoveis, clientes, users] = await Promise.all([
        fetchProcessos(),
        fetchImoveis(),
        fetchClientes(),
        fetchUsers(),
    ]);

    return {
        processos: processos ?? [],
        imoveis: imoveis ?? [],
        clientes: clientes ?? [],
        users: users ?? [],
    };
}

/**
 * Hook to fetch processos data with React Query
 */
export default function useProcessosData(user) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [...queryKeys.processos.all, 'withRelations'],
        queryFn: fetchProcessosData,
        enabled: !!user,
    });

    return {
        allProcessos: data?.processos ?? [],
        imoveis: data?.imoveis ?? [],
        clientes: data?.clientes ?? [],
        users: data?.users ?? [],
        isLoading,
        error: error?.message || null,
        reload: () => refetch(),
    };
}

/**
 * Hook to invalidate processos cache
 */
export function useInvalidateProcessos() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.processos.all });
    };
}
