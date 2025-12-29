import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { fetchUsers } from '@/services/UserService';
import { filterDataByScope } from '@/services/DashboardService';

/**
 * Fetches users data based on current user scope
 */
async function fetchUsersWithScope(user) {
    if (!user) return [];

    const allUsers = await fetchUsers();
    const scope = user.scope;
    const userId = user.sub;

    if (scope === 'ADMIN') {
        return allUsers || [];
    } else if (scope === 'GERENTE') {
        // Gerente sees only their team
        const filtered = filterDataByScope({
            scope,
            userId,
            allUsers: allUsers || [],
            allImoveis: [],
            allClientes: [],
        });
        return filtered.teamMembers || [];
    }

    // Corretor doesn't need to see other users typically
    return allUsers || [];
}

/**
 * Hook to fetch users with React Query
 */
export function useFetchUsers(user) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [...queryKeys.users.all, user?.scope, user?.sub],
        queryFn: () => fetchUsersWithScope(user),
        enabled: !!user,
    });

    return {
        allUsers: data ?? [],
        isLoading,
        error: error?.message || null,
        reload: () => refetch(),
    };
}

/**
 * Hook to invalidate users cache
 */
export function useInvalidateUsers() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    };
}

export default useFetchUsers;
