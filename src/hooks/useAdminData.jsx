import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { queryKeys } from '@/lib/queryKeys';
import { fetchImoveis } from '@/services/ImovelService';
import { fetchClientes } from '@/services/ClienteService';
import { fetchUsers } from '@/services/UserService';
import { toast } from 'sonner';

/**
 * Fetches and processes admin dashboard data
 */
async function fetchAdminData() {
    const [allUsers, allClientes, allImoveis] = await Promise.all([
        fetchUsers(),
        fetchClientes(),
        fetchImoveis(),
    ]);

    // Data Health Analysis
    const corretoresSemGerente = allUsers.filter(
        (u) => u.roles[0].nome === 'CORRETOR' && !u.gerenteId
    );
    const clientesSemCorretor = allClientes.filter((c) => !c.corretorId);
    const imoveisSemCorretor = allImoveis.filter((i) => !i.corretorId);

    const dataHealth = {
        corretoresSemGerente,
        clientesSemCorretor,
        imoveisSemCorretor,
    };

    // Team Structure Analysis
    const gerentes = allUsers.filter((u) => u.roles[0].nome === 'GERENTE');
    const corretores = allUsers.filter((u) => u.roles[0].nome === 'CORRETOR');
    const corretoresByGerente = _.groupBy(corretores, 'gerenteId');

    const structure = gerentes.map((gerente) => ({
        gerente,
        equipe: (corretoresByGerente[gerente.userId] || []).map((corretor) => ({
            corretor,
            clientes: allClientes.filter(
                (c) => c.corretorId === corretor.userId
            ),
            imoveis: allImoveis.filter((i) => i.corretorId === corretor.userId),
        })),
    }));

    // Handle orphans
    const semGerente =
        corretoresByGerente['null'] || corretoresByGerente['undefined'] || [];
    if (semGerente.length > 0) {
        structure.push({
            gerente: { nome: 'Corretores Sem Gerente', userId: 'none' },
            equipe: semGerente.map((corretor) => ({
                corretor,
                clientes: allClientes.filter(
                    (c) => c.corretorId === corretor.userId
                ),
                imoveis: allImoveis.filter(
                    (i) => i.corretorId === corretor.userId
                ),
            })),
        });
    }

    return {
        dataHealth,
        teamStructure: structure,
    };
}

/**
 * Hook to fetch admin data with React Query
 */
export const useAdminData = () => {
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.admin.data,
        queryFn: fetchAdminData,
        meta: {
            onError: (error) => {
                if (error.response?.status === 401) {
                    navigate('/login');
                    toast.error('Sessão expirada');
                }
            },
        },
    });

    return {
        dataHealth: data?.dataHealth ?? null,
        teamStructure: data?.teamStructure ?? [],
        loading: isLoading,
        error: error?.message || null,
    };
};
