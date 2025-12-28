import React, { useMemo } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { stats, isLoading, error } = useDashboardData(user);

  // Memoiza dados do gráfico de status para evitar recálculos
  const statusChartData = useMemo(() => {
    if (!stats) return [];

    return [
      {
        name: "Disponível",
        value: stats.imoveisDisponiveis || 0,
        color: "#10B981",
        icon: CheckCircle,
      },
      {
        name: "Vendido",
        value: stats.imoveisVendidos || 0,
        color: "#6366F1",
        icon: TrendingUp,
      },
      {
        name: "Alugado",
        value: stats.imoveisAlugados || 0,
        color: "#F59E0B",
        icon: Clock,
      },
      {
        name: "Reservado",
        value: stats.imoveisReservados || 0,
        color: "#EF4444",
        icon: XCircle,
      },
    ];
  }, [stats]);

  // Memoiza taxa de conversão
  const taxaConversao = useMemo(() => {
    if (!stats || !stats.totalImoveis) return 0;
    return stats.taxaConversao || 0;
  }, [stats]);

  if (authLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">{error}</h2>
        <p className="text-gray-500">Tente novamente ou contate o suporte.</p>
      </div>
    );
  }

  if (!stats) {
    return <DashboardSkeleton />;
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
            subtitle={`${stats.imoveisDisponiveis || 0} disponíveis`}
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
              title={user?.scope === "ADMIN" ? "Corretores" : "Sua Equipe"}
              value={stats.teamSize || 0}
              icon={Users2}
              gradient="from-cyan-500 to-cyan-600"
              subtitle="Membros ativos"
            />
          )}
          {user?.scope === "CORRETOR" && (
            <StatsCard
              title="Valor Disponível"
              value={`R$ ${(stats.valorTotal || 0).toLocaleString("pt-BR")}`}
              icon={DollarSign}
              gradient="from-purple-500 to-purple-600"
              subtitle="Em seus imóveis"
            />
          )}
          <StatsCard
            title="Taxa de Conversão"
            value={`${taxaConversao}%`}
            icon={TrendingUp}
            gradient="from-orange-500 to-orange-600"
            subtitle="Vendidos/Alugados"
          />
        </div>

        {/* Gráficos e atividades */}
        <div className="grid xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <StatusChart data={statusChartData} />
          </div>
          <div>
            <PriceRangeChart
              imoveis={stats._fullImoveisForCharts || stats.imoveisData || []}
            />
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
