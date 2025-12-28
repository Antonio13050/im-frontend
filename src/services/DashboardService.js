/**
 * DashboardService - Serviço para lógica de negócio do Dashboard
 * Centraliza cálculos de estatísticas e filtragem por escopo de usuário
 *
 * ⚠️ OTIMIZAÇÃO DE PERFORMANCE:
 * Para melhorar significativamente a performance, o backend deveria implementar:
 * 1. Endpoint /api/dashboard/stats que retorna apenas estatísticas agregadas
 * 2. Queries otimizadas com COUNT, SUM, GROUP BY em vez de buscar todos os registros
 * 3. Cache no backend para estatísticas que mudam pouco
 * 4. Paginação ou limites nas queries de listagem
 */

/**
 * Filtra imóveis e clientes baseado no escopo do usuário
 * @param {Object} params - Parâmetros de filtragem
 * @param {string} params.scope - Escopo do usuário (ADMIN, GERENTE, CORRETOR)
 * @param {string} params.userId - ID do usuário atual
 * @param {Array} params.allUsers - Lista de todos os usuários
 * @param {Array} params.allImoveis - Lista de todos os imóveis
 * @param {Array} params.allClientes - Lista de todos os clientes
 * @returns {Object} Objeto com imoveis e clientes filtrados
 */
export const filterDataByScope = ({
  scope,
  userId,
  allUsers = [],
  allImoveis = [],
  allClientes = [],
}) => {
  if (scope === "ADMIN") {
    return {
      imoveis: allImoveis,
      clientes: allClientes,
      teamMembers: allUsers.filter((u) => u.roles?.[0]?.nome === "CORRETOR"),
    };
  }

  if (scope === "GERENTE") {
    const teamIds = allUsers
      .filter((u) => u.gerenteId == userId)
      .map((u) => u.userId);
    const allManagedIds = [userId, ...teamIds];

    return {
      imoveis: allImoveis.filter((i) => allManagedIds.includes(i.corretorId)),
      clientes: allClientes.filter((c) => allManagedIds.includes(c.corretorId)),
      teamMembers: allUsers.filter((u) => u.gerenteId == userId || u.userId == userId),
    };
  }

  if (scope === "CORRETOR") {
    return {
      imoveis: allImoveis.filter((i) => i.corretorId === userId),
      clientes: allClientes.filter((c) => c.corretorId === userId),
      teamMembers: [],
    };
  }

  // Escopo inválido
  return {
    imoveis: [],
    clientes: [],
    teamMembers: [],
  };
};

/**
 * Calcula estatísticas dos imóveis
 * @param {Array} imoveis - Lista de imóveis
 * @returns {Object} Estatísticas calculadas
 */
export const calculateImoveisStats = (imoveis = []) => {
  const imoveisDisponiveis = imoveis.filter(
    (i) => i.status === "disponivel"
  ).length;
  const imoveisVendidos = imoveis.filter((i) => i.status === "vendido").length;
  const imoveisAlugados = imoveis.filter((i) => i.status === "alugado").length;
  const imoveisReservados = imoveis.filter(
    (i) => i.status === "reservado"
  ).length;

  const valorTotal = imoveis
    .filter((i) => i.status === "disponivel")
    .reduce((sum, i) => sum + (i.preco || 0), 0);

  const taxaConversao =
    imoveis.length > 0
      ? Math.round(((imoveisVendidos + imoveisAlugados) / imoveis.length) * 100)
      : 0;

  return {
    totalImoveis: imoveis.length,
    imoveisDisponiveis,
    imoveisVendidos,
    imoveisAlugados,
    imoveisReservados,
    valorTotal,
    taxaConversao,
  };
};

/**
 * Calcula estatísticas gerais do dashboard
 * @param {Object} params - Parâmetros
 * @param {Array} params.imoveis - Lista de imóveis filtrados (completa para cálculos)
 * @param {Array} params.clientes - Lista de clientes filtrados (completa para cálculos)
 * @param {number} params.teamSize - Tamanho da equipe
 * @param {number} params.recentLimit - Limite de itens recentes para RecentActivity (padrão: 6)
 * @returns {Object} Estatísticas completas
 */
export const calculateDashboardStats = ({
  imoveis,
  clientes,
  teamSize = 0,
  recentLimit = 6,
}) => {
  const imoveisStats = calculateImoveisStats(imoveis);

  // Limita dados apenas para RecentActivity (reduz memória)
  // PriceRangeChart precisa dos dados completos para calcular faixas
  const recentImoveis = [...imoveis]
    .sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0))
    .slice(0, recentLimit);

  const recentClientes = [...clientes]
    .sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0))
    .slice(0, recentLimit);

  return {
    ...imoveisStats,
    totalClientes: clientes.length,
    teamSize,
    // Dados recentes apenas para RecentActivity
    imoveisData: recentImoveis,
    clientesData: recentClientes,
    // Mantém dados completos para gráficos que precisam (PriceRangeChart)
    // Mas apenas em memória durante cálculo, não persiste no estado
    _fullImoveisForCharts: imoveis,
  };
};
