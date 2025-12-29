import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import Layout from "@/components/layouts/Layout";

// Import all page-specific skeletons directly (small components, no lazy loading needed)
import { ClientesSkeleton } from "@/components/clientes/clientePage/ClientesSkeleton";
import { ClienteDetalhesSkeleton } from "@/components/clientes/clientePage/ClienteDetalhesSkeleton";
import { CorretoresSkeleton } from "@/components/corretores/corretorPage/CorretoresSkeleton";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ImoveisSkeleton } from "@/components/imoveis/imovelPage/ImoveisSkeleton";
import { ImovelDetalhesSkeleton } from "@/components/imoveis/imovelPage/ImovelDetalhesSkeleton";
import { ProcessosSkeleton } from "@/components/processos/ProcessosSkeleton";
import { VisitasSkeleton } from "@/components/visitas/VisitasSkeleton";
import { AgendaSkeleton } from "@/components/visitas/AgendaSkeleton";
import { MapaSkeleton } from "@/components/mapa/MapaSkeleton";
import { ImobiliariaSkeleton } from "@/components/imobiliaria/ImobiliariaSkeleton";
import { FormularioSkeleton } from "@/components/common/FormularioSkeleton";
import { LoginSkeleton } from "@/components/common/LoginSkeleton";
import PageLoader from "@/components/common/PageLoader";

// Lazy load all pages for code splitting
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Imoveis = lazy(() => import("@/pages/Imoveis"));
const ImovelNovo = lazy(() => import("@/pages/ImovelNovo"));
const ImovelEditar = lazy(() => import("@/pages/ImovelEditar"));
const ImovelDetalhes = lazy(() => import("@/pages/ImovelDetalhes"));
const Clientes = lazy(() => import("@/pages/Clientes"));
const ClienteNovo = lazy(() => import("@/pages/ClienteNovo"));
const ClienteEditar = lazy(() => import("@/pages/ClienteEditar"));
const ClienteDetalhes = lazy(() => import("@/pages/ClienteDetalhes"));
const ClienteImoveisPersonalizados = lazy(() => import("@/pages/ClienteImoveisPersonalizados"));
const Corretores = lazy(() => import("@/pages/Corretores"));
const Mapa = lazy(() => import("@/pages/Mapa"));
const ImobiliariaPage = lazy(() => import("@/pages/Imobiliaria"));
const RelatorioAdmin = lazy(() => import("@/pages/RelatorioAdmin"));
const Processos = lazy(() => import("@/pages/Processos"));
const Visitas = lazy(() => import("@/pages/Visitas"));
const Agenda = lazy(() => import("@/pages/Agenda"));

export default function RoutesComponent() {
  return (
    <Routes>
      {/* Rotas protegidas com Layout */}
      <Route
        path="/"
        element={
          <PrivateRoutes>
            <Layout />
          </PrivateRoutes>
        }
      >
        {/* Dashboard */}
        <Route index element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="dashboard" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
          </Suspense>
        } />

        {/* Imóveis */}
        <Route path="imoveis" element={
          <Suspense fallback={<ImoveisSkeleton />}>
            <Imoveis />
          </Suspense>
        } />
        <Route path="imoveis/novo" element={
          <Suspense fallback={<FormularioSkeleton />}>
            <ImovelNovo />
          </Suspense>
        } />
        <Route path="imoveis/:id/editar" element={
          <Suspense fallback={<FormularioSkeleton />}>
            <ImovelEditar />
          </Suspense>
        } />
        <Route path="imovel-detalhes/:id" element={
          <Suspense fallback={<ImovelDetalhesSkeleton />}>
            <ImovelDetalhes />
          </Suspense>
        } />

        {/* Clientes */}
        <Route path="clientes" element={
          <Suspense fallback={<ClientesSkeleton />}>
            <Clientes />
          </Suspense>
        } />
        <Route path="clientes/novo" element={
          <Suspense fallback={<FormularioSkeleton />}>
            <ClienteNovo />
          </Suspense>
        } />
        <Route path="clientes/:id/editar" element={
          <Suspense fallback={<FormularioSkeleton />}>
            <ClienteEditar />
          </Suspense>
        } />
        <Route path="cliente-detalhes/:id" element={
          <Suspense fallback={<ClienteDetalhesSkeleton />}>
            <ClienteDetalhes />
          </Suspense>
        } />

        {/* Corretores */}
        <Route path="corretores" element={
          <Suspense fallback={<CorretoresSkeleton />}>
            <Corretores />
          </Suspense>
        } />

        {/* Mapa */}
        <Route path="mapa" element={
          <Suspense fallback={<MapaSkeleton />}>
            <Mapa />
          </Suspense>
        } />

        {/* Imobiliária e Relatórios */}
        <Route path="imobiliaria" element={
          <Suspense fallback={<ImobiliariaSkeleton />}>
            <ImobiliariaPage />
          </Suspense>
        } />
        <Route path="relatorio-admin" element={
          <Suspense fallback={<DashboardSkeleton />}>
            <RelatorioAdmin />
          </Suspense>
        } />

        {/* Processos e Visitas */}
        <Route path="processos" element={
          <Suspense fallback={<ProcessosSkeleton />}>
            <Processos />
          </Suspense>
        } />
        <Route path="visitas" element={
          <Suspense fallback={<VisitasSkeleton />}>
            <Visitas />
          </Suspense>
        } />
        <Route path="agenda" element={
          <Suspense fallback={<AgendaSkeleton />}>
            <Agenda />
          </Suspense>
        } />

        <Route path="*" element={<h1>Page not found</h1>} />
      </Route>

      {/* Rota de login sem Layout */}
      <Route path="login" element={
        <Suspense fallback={<LoginSkeleton />}>
          <Login />
        </Suspense>
      } />

      {/* Página personalizada de imóveis por cliente (pública) */}
      <Route path="cliente-imoveis/:id" element={
        <Suspense fallback={<ImoveisSkeleton />}>
          <ClienteImoveisPersonalizados />
        </Suspense>
      } />

      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
}
