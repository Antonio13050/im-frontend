import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Imoveis from "./pages/Imoveis";
import Mapa from "./pages/Mapa";
import ImovelDetalhes from "./pages/ImovelDetalhes";
import Clientes from "./pages/Clientes";
import AddRoom from "./components/imoveis/AddRoom";
import ViewImovel from "./components/imoveis/ViewImovel";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Toaster />
                <Routes>
                    <Route path="*" element={<div>Not Found</div>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/imoveis" element={<Imoveis />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route
                        path="/corretores"
                        element={<div>Corretores Page</div>}
                    />
                    <Route path="/mapa" element={<Mapa />} />
                    <Route
                        path="/imobiliaria"
                        element={<div>Imobiliária Page</div>}
                    />
                    <Route
                        path="/imovel-detalhes/:id"
                        element={<ImovelDetalhes />}
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
