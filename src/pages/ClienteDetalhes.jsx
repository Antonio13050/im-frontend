import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, Button } from "@/components/ui/card";
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    Home,
    ArrowLeft,
    Frown,
    AlertCircle,
} from "lucide-react";
import { useClienteDetails } from "@/hooks/useClienteDetails";
import { formatPrice, formatDate } from "@/lib/formatters";

const LoadingSkeleton = () => (
    <div className="container mx-auto p-4">
        <div className="mb-4">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default function ClienteDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cliente, corretor, imoveisVinculados, loading, error } =
        useClienteDetails(id);

    const goBack = () => navigate(-1);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error || !cliente) {
        return (
            <div className="container mx-auto p-4 text-center">
                <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-600">
                    {error || "Cliente não encontrado"}
                </h2>
                <p className="text-gray-600">
                    Tente novamente ou contate o suporte.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4" role="main">
            <Button
                onClick={goBack}
                variant="outline"
                className="mb-4"
                aria-label="Voltar à página anterior"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna Esquerda: Informações do Cliente */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" aria-hidden="true" />
                            {cliente.nome}
                            {corretor && (
                                <Badge variant="secondary" className="ml-2">
                                    Atribuído a {corretor.nome}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className="flex items-center gap-2"
                            title="Data de Cadastro"
                        >
                            <Calendar
                                className="h-5 w-5 text-muted-foreground flex-shrink-0"
                                aria-hidden="true"
                            />
                            Cadastrado em {formatDate(cliente.createdDate)}
                        </div>
                        <div className="flex items-center gap-2" title="E-mail">
                            <Mail
                                className="h-5 w-5 text-muted-foreground flex-shrink-0"
                                aria-hidden="true"
                            />
                            <a
                                href={`mailto:${cliente.email}`}
                                className="hover:underline"
                            >
                                {cliente.email || "N/A"}
                            </a>
                        </div>
                        <div
                            className="flex items-center gap-2"
                            title="Telefone"
                        >
                            <Phone
                                className="h-5 w-5 text-muted-foreground flex-shrink-0"
                                aria-hidden="true"
                            />
                            {cliente.telefone || "N/A"}
                        </div>
                        {cliente.endereco && (
                            <div
                                className="flex items-center gap-2"
                                title="Endereço"
                            >
                                <MapPin
                                    className="h-5 w-5 text-muted-foreground flex-shrink-0"
                                    aria-hidden="true"
                                />
                                {cliente.endereco}
                            </div>
                        )}
                        {cliente.orcamento && (
                            <div
                                className="flex items-center gap-2"
                                title="Orçamento"
                            >
                                <DollarSign
                                    className="h-5 w-5 text-muted-foreground flex-shrink-0"
                                    aria-hidden="true"
                                />
                                Orçamento: {formatPrice(cliente.orcamento)}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Coluna Direita: Corretor e Imóveis Vinculados */}
                <div className="space-y-6">
                    {corretor ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    Corretor Responsável
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="font-medium">{corretor.nome}</p>
                                <p className="text-sm text-muted-foreground">
                                    {corretor.email}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-8 text-muted-foreground">
                                <Frown className="w-8 h-8 mx-auto mb-2" />
                                Sem corretor atribuído
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="h-5 w-5" aria-hidden="true" />
                                Imóveis Vinculados ({imoveisVinculados.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {imoveisVinculados.length > 0 ? (
                                <ul className="space-y-2">
                                    {imoveisVinculados.map((imovel) => (
                                        <li
                                            key={imovel.id}
                                            className="flex justify-between items-center p-2 border rounded"
                                        >
                                            <Link
                                                to={`/imovel-detalhes/${imovel.id}`}
                                                className="font-medium hover:underline flex-1"
                                            >
                                                {imovel.titulo}
                                            </Link>
                                            <div className="flex items-center gap-2 ml-4">
                                                <span className="text-sm">
                                                    {imovel.status}
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {formatPrice(imovel.preco)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    Nenhum imóvel vinculado.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
