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
import ClienteDetalhes from "@/pages/ClienteDetalhes";
import ImobiliariaPage from "@/pages/Imobiliaria";

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
                <Route path="clientes" element={<Clientes />} />
                <Route path="corretores" element={<Corretores />} />
                <Route path="mapa" element={<Mapa />} />
                <Route path="imobiliaria" element={<ImobiliariaPage />} />
                <Route path="relatorio-admin" element={<RelatorioAdmin />} />
                <Route
                    path="imovel-detalhes/:id"
                    element={<ImovelDetalhes />}
                />
                <Route
                    path="cliente-detalhes/:id"
                    element={<ClienteDetalhes />}
                />
                <Route path="*" element={<h1>Page not found</h1>} />
            </Route>
            {/* Rota de login sem Layout */}
            <Route path="login" element={<Login />} />
            {/* Rota para páginas não encontradas */}
            <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
    );
}
