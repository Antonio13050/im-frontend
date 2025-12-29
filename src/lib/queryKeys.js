/**
 * Centralized query keys for React Query cache management.
 * Use these keys for consistent cache invalidation across the app.
 */
export const queryKeys = {
    // Clientes
    clientes: {
        all: ['clientes'],
        byCorretor: (corretorId) => ['clientes', 'corretor', corretorId],
        detail: (id) => ['clientes', 'detail', id],
    },

    // Imóveis
    imoveis: {
        all: ['imoveis'],
        byCorretor: (corretorId) => ['imoveis', 'corretor', corretorId],
        detail: (id) => ['imoveis', 'detail', id],
    },

    // Usuários
    users: {
        all: ['users'],
        detail: (id) => ['users', 'detail', id],
    },

    // Visitas
    visitas: {
        all: ['visitas'],
        byCorretor: (corretorId) => ['visitas', 'corretor', corretorId],
    },

    // Processos
    processos: {
        all: ['processos'],
    },

    // Dashboard
    dashboard: {
        data: (userId, scope) => ['dashboard', userId, scope],
    },

    // Admin
    admin: {
        data: ['admin', 'data'],
    },
};

/**
 * Helper to invalidate all queries for a specific entity
 * @param {QueryClient} queryClient - The query client instance
 * @param {string} entity - Entity name (clientes, imoveis, users, etc.)
 */
export const invalidateEntity = (queryClient, entity) => {
    if (queryKeys[entity]?.all) {
        queryClient.invalidateQueries({ queryKey: queryKeys[entity].all });
    }
};
