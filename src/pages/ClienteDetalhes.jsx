import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Added useLocation and useNavigate
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    Home,
    ArrowLeft,
    Building2,
    Tag,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchUsers } from "@/services/UserService";
import { fetchClientes } from "@/services/ClienteService";
import { Link } from "react-router-dom";

export default function ClienteDetalhes() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [corretor, setCorretor] = useState(null);
    const [imoveisVinculados, setImoveisVinculados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setIsLoading(true);
                const [clientes, usuarios, imoveis] = await Promise.all([
                    fetchClientes(),
                    fetchUsers(),
                    fetchImoveis(),
                ]);

                const clienteData = clientes.find((c) => c.id == id);
                if (!clienteData) {
                    setError("Cliente não encontrado");
                    setIsLoading(false);
                    return;
                }
                setCliente(clienteData);

                if (clienteData.corretorId) {
                    const corretorData = usuarios.find(
                        (u) => u.id === clienteData.corretorId
                    );
                    setCorretor(corretorData || null);
                }

                const vinculados = imoveis.filter((i) => i.clienteId == id);
                setImoveisVinculados(vinculados || []);
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
                setError("Erro ao carregar os dados do cliente");
            } finally {
                setIsLoading(false);
            }
        };
        loadDetails();
    }, [id]);

    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const goBack = () => navigate(-1);

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    if (!cliente) {
        return (
            <div className="p-8 text-center">
                <UserIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold">Cliente não encontrado</h2>
                <Button onClick={goBack} className="mt-4">
                    Voltar
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <Button variant="outline" onClick={goBack} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna Esquerda: Informações do Cliente */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {cliente.nome}
                                        </CardTitle>
                                        <p className="text-gray-500">
                                            Cadastrado em{" "}
                                            {cliente.createdDate
                                                ? format(
                                                      new Date(
                                                          cliente.createdDate
                                                      ),
                                                      "dd/MM/yyyy",
                                                      { locale: ptBR }
                                                  )
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span>{cliente.email || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>{cliente.telefone}</span>
                                </div>
                                {cliente.cpf_cnpj && (
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-gray-500" />
                                        <span>
                                            CPF/CNPJ: {cliente.cpf_cnpj}
                                        </span>
                                    </div>
                                )}
                                {cliente.data_nascimento && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span>
                                            Nascido em:{" "}
                                            {format(
                                                new Date(
                                                    cliente.data_nascimento
                                                ),
                                                "dd/MM/yyyy",
                                                { locale: ptBR }
                                            )}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {corretor && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Corretor Responsável</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-semibold">
                                        {corretor.nome}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {corretor.email}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Coluna Direita: Interesses e Imóveis Vinculados */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Interesses do Cliente</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge>
                                        {cliente.interesses?.finalidade ===
                                        "venda"
                                            ? "Busca Comprar"
                                            : "Busca Alugar"}
                                    </Badge>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Tipos de Imóvel
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {cliente.interesses?.tiposImovel?.map(
                                            (t) => (
                                                <Badge
                                                    variant="secondary"
                                                    key={t}
                                                >
                                                    {t}
                                                </Badge>
                                            )
                                        ) || <p>N/A</p>}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Faixa de Preço
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        <span>
                                            {formatPrice(
                                                cliente.interesses
                                                    ?.faixa_preco_min
                                            )}{" "}
                                            -{" "}
                                            {formatPrice(
                                                cliente.interesses
                                                    ?.faixa_preco_max
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">
                                        Bairros de Interesse
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {cliente.interesses?.bairrosInteresse?.map(
                                            (b) => (
                                                <Badge
                                                    variant="outline"
                                                    key={b}
                                                >
                                                    {b}
                                                </Badge>
                                            )
                                        ) || <p>N/A</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Imóveis Vinculados (
                                    {imoveisVinculados.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {imoveisVinculados.length > 0 ? (
                                    imoveisVinculados.map((imovel) => (
                                        <Link
                                            to={`/imovel-detalhes/${imovel.id}`} // Updated to match route path
                                            key={imovel.id}
                                            className="block p-3 border rounded-lg hover:bg-gray-100"
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-semibold text-blue-700">
                                                        {imovel.titulo}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {imovel.endereco.bairro}
                                                        ,{" "}
                                                        {imovel.endereco.cidade}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge
                                                        className={
                                                            imovel.status ===
                                                            "vendido"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }
                                                    >
                                                        {imovel.status}
                                                    </Badge>
                                                    <p className="font-bold text-lg">
                                                        {formatPrice(
                                                            imovel.preco
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-gray-500">
                                        Nenhum imóvel vinculado a este cliente.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {cliente.observacoes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Observações</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line">
                                        {cliente.observacoes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
