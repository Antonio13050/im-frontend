import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { fetchClientes } from '@/services/ClienteService';
import { fetchUsers } from '@/services/UserService';
import { fetchImoveis } from '@/services/ImovelService';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Fetches cliente details with related data
 */
async function fetchClienteDetails(id, currentUser) {
    const [allClientes, allUsers, allImoveis] = await Promise.all([
        fetchClientes(),
        fetchUsers(),
        fetchImoveis(),
    ]);

    const cliente = allClientes.find((c) => c.id == id);
    if (!cliente) {
        throw new Error('Cliente não encontrado');
    }

    const usersMap = new Map(allUsers.map((u) => [Number(u.userId), u.nome]));
    if (currentUser) {
        usersMap.set(Number(currentUser.sub), currentUser.nome);
    }

    const imoveisVinculados = allImoveis.filter((i) => i.clienteId == id);

    return { cliente, usersMap, imoveisVinculados };
}

/**
 * Hook to fetch cliente details with React Query
 */
export default function useClienteDetails(id) {
    const { user: currentUser } = useAuth();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.clientes.detail(id),
        queryFn: () => fetchClienteDetails(id, currentUser),
        enabled: !!id,
    });

    return {
        cliente: data?.cliente ?? null,
        usersMap: data?.usersMap ?? new Map(),
        imoveisVinculados: data?.imoveisVinculados ?? [],
        isLoading,
        error: error?.message || null,
        reload: () => refetch(),
    };
}
