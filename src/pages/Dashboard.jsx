import React, { useState, useEffect } from "react";
import {
    Home,
    Users,
    DollarSign,
    TrendingUp,
    CheckCircle,
    Clock,
    XCircle,
    Users2,
} from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import StatusChart from "../components/dashboard/StatusChart";
import PriceRangeChart from "../components/dashboard/PriceRangeChart";
import QuickShortcuts from "../components/dashboard/QuickShortcuts";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [stats, setStats] = useState({});
    const { user, isLoading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setError("Usuário não autenticado");
            setIsLoading(false);
            navigate("/login");
            return;
        }
        loadDashboardData();
    }, [user, authLoading, navigate]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            let imoveis = [];
            let clientes = [];
            let teamMembers = [];

            const allUsers = await fetchUsers();

            if (user.scope === "ADMIN") {
                imoveis = await fetchImoveis();
                clientes = await fetchClientes();
                teamMembers = allUsers.filter(
                    (u) => u.roles[0].nome === "CORRETOR"
                );
            } else if (user.scope === "GERENTE") {
                const teamIds = allUsers
                    .filter((u) => u.gerenteId == user.sub)
                    .map((u) => u.userId);
                teamMembers = allUsers.filter((u) => u.gerenteId == user.sub);
                const allManagedIds = [user.sub, ...teamIds];
                const allImoveis = await fetchImoveis();
                const allClientes = await fetchClientes();

                imoveis = allImoveis.filter((i) =>
                    allManagedIds.includes(i.corretorId)
                );
                clientes = allClientes.filter((c) =>
                    allManagedIds.includes(c.corretorId)
                );
            } else if (user.scope === "CORRETOR") {
                imoveis = await fetchImoveis({ corretorId: user.sub });
                clientes = await fetchClientes({ corretorId: user.sub });
            } else {
                throw new Error("Escopo de usuário inválido");
            }

            const imoveisDisponiveis = imoveis.filter(
                (i) => i.status === "disponivel"
            ).length;
            const imoveisVendidos = imoveis.filter(
                (i) => i.status === "vendido"
            ).length;
            const imoveisAlugados = imoveis.filter(
                (i) => i.status === "alugado"
            ).length;
            const valorTotal = imoveis
                .filter((i) => i.status === "disponivel")
                .reduce((sum, i) => sum + (i.preco || 0), 0);

            setStats({
                totalImoveis: imoveis.length,
                imoveisDisponiveis,
                imoveisVendidos,
                imoveisAlugados,
                totalClientes: clientes.length,
                valorTotal,
                imoveisData: imoveis,
                clientesData: clientes,
                teamSize: teamMembers.length,
            });
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            if (error.response?.status === 401) {
                setError("Sessão expirada. Faça login novamente.");
                navigate("/login");
            } else {
                setError("Erro ao carregar os dados do dashboard");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="h-32 bg-gray-200 rounded-lg"
                                ></div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-600">{error}</h2>
                <p className="text-gray-500">
                    Tente novamente ou contate o suporte.
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen">
            <div className="max-w-[1800px] 2xl:max-w-none mx-auto">
                {/* Atalhos Rápidos */}
                <QuickShortcuts />

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total de Imóveis"
                        value={stats.totalImoveis || 0}
                        icon={Home}
                        gradient="from-blue-500 to-blue-600"
                        subtitle={`${
                            stats.imoveisDisponiveis || 0
                        } disponíveis`}
                    />
                    <StatsCard
                        title="Clientes"
                        value={stats.totalClientes || 0}
                        icon={Users}
                        gradient="from-emerald-500 to-emerald-600"
                        subtitle="Leads ativos"
                    />
                    {user?.scope !== "CORRETOR" && (
                        <StatsCard
                            title={
                                user?.scope === "ADMIN"
                                    ? "Corretores"
                                    : "Sua Equipe"
                            }
                            value={stats.teamSize || 0}
                            icon={Users2}
                            gradient="from-cyan-500 to-cyan-600"
                            subtitle="Membros ativos"
                        />
                    )}
                    {user?.scope === "CORRETOR" && (
                        <StatsCard
                            title="Valor Disponível"
                            value={`R$ ${(stats.valorTotal || 0).toLocaleString(
                                "pt-BR"
                            )}`}
                            icon={DollarSign}
                            gradient="from-purple-500 to-purple-600"
                            subtitle="Em seus imóveis"
                        />
                    )}
                    <StatsCard
                        title="Taxa de Conversão"
                        value={`${
                            stats.totalImoveis > 0
                                ? Math.round(
                                      ((stats.imoveisVendidos +
                                          stats.imoveisAlugados) /
                                          stats.totalImoveis) *
                                          100
                                  )
                                : 0
                        }%`}
                        icon={TrendingUp}
                        gradient="from-orange-500 to-orange-600"
                        subtitle="Vendidos/Alugados"
                    />
                </div>

                {/* Gráficos e atividades */}
                <div className="grid xl:grid-cols-3 gap-6 mb-8">
                    <div className="xl:col-span-2">
                        <StatusChart
                            data={[
                                {
                                    name: "Disponível",
                                    value: stats.imoveisDisponiveis,
                                    color: "#10B981",
                                    icon: CheckCircle,
                                },
                                {
                                    name: "Vendido",
                                    value: stats.imoveisVendidos,
                                    color: "#6366F1",
                                    icon: TrendingUp,
                                },
                                {
                                    name: "Alugado",
                                    value: stats.imoveisAlugados,
                                    color: "#F59E0B",
                                    icon: Clock,
                                },
                                {
                                    name: "Reservado",
                                    value: (stats.imoveisData || []).filter(
                                        (i) => i.status === "reservado"
                                    ).length,
                                    color: "#EF4444",
                                    icon: XCircle,
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <PriceRangeChart imoveis={stats.imoveisData || []} />
                    </div>
                </div>

                <RecentActivity
                    imoveis={stats.imoveisData || []}
                    clientes={stats.clientesData || []}
                />
            </div>
        </div>
    );
}
