import { Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import Login from "@/pages/Login";
import Layout from "@/components/layouts/Layout";
import Dashboard from "@/pages/Dashboard";
import Imoveis from "@/pages/Imoveis";
import Mapa from "@/pages/Mapa";
import ImovelDetalhes from "@/pages/ImovelDetalhes";
import Clientes from "@/pages/Clientes";
import Corretores from "@/pages/Corretores";
import RelatorioAdmin from "@/pages/RelatorioAdmin";
import ClienteImoveisPersonalizados from "@/pages/ClienteImoveisPersonalizados";
import ClienteDetalhes from "@/pages/ClienteDetalhes";
import ImobiliariaPage from "@/pages/Imobiliaria";
import Processos from "@/pages/Processos";
import Visitas from "@/pages/Visitas";
import Agenda from "@/pages/Agenda";
import ImovelNovo from "@/pages/ImovelNovo";
import ImovelEditar from "@/pages/ImovelEditar";

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
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="imoveis" element={<Imoveis />} />
        <Route path="imoveis/novo" element={<ImovelNovo />} />
        <Route path="imoveis/:id/editar" element={<ImovelEditar />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="corretores" element={<Corretores />} />
        <Route path="mapa" element={<Mapa />} />
        <Route path="imobiliaria" element={<ImobiliariaPage />} />
        <Route path="relatorio-admin" element={<RelatorioAdmin />} />
        <Route path="processos" element={<Processos />} />
        <Route path="visitas" element={<Visitas />} />
        <Route path="agenda" element={<Agenda />} />

        <Route path="imovel-detalhes/:id" element={<ImovelDetalhes />} />
        <Route path="cliente-detalhes/:id" element={<ClienteDetalhes />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Route>
      {/* Rota de login sem Layout */}
      <Route path="login" element={<Login />} />
      {/* Página personalizada de imóveis por cliente (pública) */}
      <Route
        path="cliente-imoveis/:id"
        element={<ClienteImoveisPersonalizados />}
      />
      {/* Rota para páginas não encontradas */}
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
}
