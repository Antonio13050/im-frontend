import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { fetchVisitas } from '@/services/VisitaService';
import { fetchImoveis } from '@/services/ImovelService';
import { fetchClientes } from '@/services/ClienteService';
import { fetchUsers } from '@/services/UserService';

/**
 * Fetches all visitas related data
 */
async function fetchVisitasData() {
    const [visitas, imoveis, clientes, users] = await Promise.all([
        fetchVisitas(),
        fetchImoveis(),
        fetchClientes(),
        fetchUsers(),
    ]);

    return {
        visitas: visitas ?? [],
        imoveis: imoveis ?? [],
        clientes: clientes ?? [],
        users: users ?? [],
    };
}

/**
 * Hook to fetch visitas data with React Query
 */
export default function useVisitasData(user) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [...queryKeys.visitas.all, 'withRelations'],
        queryFn: fetchVisitasData,
        enabled: !!user,
    });

    return {
        visitas: data?.visitas ?? [],
        imoveis: data?.imoveis ?? [],
        clientes: data?.clientes ?? [],
        users: data?.users ?? [],
        isLoading,
        error: error?.message || null,
        reload: () => refetch(),
    };
}

/**
 * Hook to invalidate visitas cache
 */
export function useInvalidateVisitas() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.visitas.all });
    };
}
