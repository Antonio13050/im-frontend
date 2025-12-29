import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * React Query configuration
 * - staleTime: 60s (data is fresh for 60 seconds, matches previous cache TTL)
 * - gcTime: 5 minutes (garbage collection time)
 * - retry: 1 (retry failed requests once)
 * - refetchOnWindowFocus: true (refetch when user returns to tab)
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 60 seconds
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
        },
        mutations: {
            retry: 0,
        },
    },
});

/**
 * QueryProvider component to wrap the app
 * Includes DevTools in development mode
 */
export function QueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export { queryClient };
