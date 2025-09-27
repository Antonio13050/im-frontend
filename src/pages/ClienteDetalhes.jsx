import React, { memo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useClienteDetails from "@/hooks/useClienteDetails";
import {
    formatPrice,
    formatDate,
    formatCpfCnpj,
    formatTelefone,
} from "@/lib/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    Home,
    ArrowLeft,
    AlertCircle,
    FileText,
} from "lucide-react";

const LoadingSkeleton = memo(() => (
    <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-6">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        </div>
    </div>
));

export default function ClienteDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cliente, usersMap, imoveisVinculados, isLoading, error } =
        useClienteDetails(id);

    const goBack = () => navigate(-1);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error || !cliente) {
        return (
            <div className="container mx-auto p-4 sm:p-6 text-center">
                <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-600">
                    {error || "Cliente não encontrado"}
                </h2>
                <p className="text-gray-600 mt-2">
                    Tente novamente ou contate o suporte.
                </p>
            </div>
        );
    }
    console.log(usersMap);
    const corretorNome = cliente.corretorId
        ? usersMap.get(Number(cliente.corretorId))
        : null;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <Button
                    onClick={goBack}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100 transition-colors"
                    aria-label="Voltar à página anterior"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </div>

            <div className="space-y-5">
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <UserIcon
                            className="h-5 w-5 text-gray-500"
                            aria-hidden="true"
                        />
                        {cliente.nome}
                        {corretorNome && (
                            <Badge
                                variant="secondary"
                                className="ml-2 bg-gray-100 text-gray-700"
                            >
                                Atribuído a {corretorNome}
                            </Badge>
                        )}
                    </h2>
                    <Card className="border-none shadow-sm bg-white">
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        className="h-5 w-5 text-gray-500 flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Cadastrado em:{" "}
                                        {format(
                                            new Date(cliente.createdDate),
                                            "dd/MM/yyyy 'às' HH:mm",
                                            { locale: ptBR }
                                        )}
                                    </span>
                                </div>
                                {cliente.dataNascimento && (
                                    <div className="flex items-center gap-2">
                                        <Calendar
                                            className="h-5 w-5 text-gray-500 flex-shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Nascimento:{" "}
                                            {formatDate(cliente.dataNascimento)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Mail
                                        className="h-5 w-5 text-gray-500 flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    <a
                                        href={`mailto:${cliente.email}`}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {cliente.email || "N/A"}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone
                                        className="h-5 w-5 text-gray-500 flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {formatTelefone(cliente.telefone)}
                                    </span>
                                </div>
                                {cliente.cpfCnpj && (
                                    <div className="flex items-center gap-2">
                                        <FileText
                                            className="h-5 w-5 text-gray-500 flex-shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm text-gray-700">
                                            CPF/CNPJ:{" "}
                                            {formatCpfCnpj(cliente.cpfCnpj)}
                                        </span>
                                    </div>
                                )}
                                {cliente.endereco && (
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            className="h-5 w-5 text-gray-500 flex-shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm text-gray-700">
                                            {cliente.endereco}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Interests Section */}
                {cliente.interesses && (
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign
                                className="h-5 w-5 text-gray-500"
                                aria-hidden="true"
                            />
                            Interesses
                        </h2>
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent className="space-y-4">
                                {cliente.interesses.tiposImovel?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Tipos de Imóvel:
                                        </span>
                                        {cliente.interesses.tiposImovel.map(
                                            (tipo, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors"
                                                >
                                                    {tipo}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                )}
                                {cliente.interesses.bairrosInteresse?.length >
                                    0 && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            Bairros:
                                        </span>
                                        {cliente.interesses.bairrosInteresse.map(
                                            (bairro, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors"
                                                >
                                                    {bairro}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                )}
                                {(cliente.interesses.faixaPrecoMin ||
                                    cliente.interesses.faixaPrecoMax) && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign
                                            className="h-5 w-5 text-gray-500 flex-shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Faixa de Preço:{" "}
                                            {cliente.interesses.faixaPrecoMin &&
                                            cliente.interesses.faixaPrecoMax
                                                ? `${formatPrice(
                                                      cliente.interesses
                                                          .faixaPrecoMin
                                                  )} - ${formatPrice(
                                                      cliente.interesses
                                                          .faixaPrecoMax
                                                  )}`
                                                : cliente.interesses
                                                      .faixaPrecoMin
                                                ? `A partir de ${formatPrice(
                                                      cliente.interesses
                                                          .faixaPrecoMin
                                                  )}`
                                                : `Até ${formatPrice(
                                                      cliente.interesses
                                                          .faixaPrecoMax
                                                  )}`}
                                        </span>
                                    </div>
                                )}
                                {cliente.interesses.finalidade && (
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={
                                                cliente.interesses
                                                    .finalidade === "venda"
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                                    : "bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                            }
                                        >
                                            {cliente.interesses.finalidade ===
                                            "venda"
                                                ? "Compra"
                                                : "Aluguel"}
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                )}

                {/* Observations Section */}
                {cliente.observacoes && (
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText
                                className="h-5 w-5 text-gray-500"
                                aria-hidden="true"
                            />
                            Observações
                        </h2>
                        <Card className="border-none shadow-sm bg-white">
                            <CardContent>
                                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                                    {cliente.observacoes}
                                </p>
                            </CardContent>
                        </Card>
                    </section>
                )}

                {/* Corretor Section */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <UserIcon
                            className="h-5 w-5 text-gray-500"
                            aria-hidden="true"
                        />
                        Corretor Responsável
                    </h2>
                    <Card className="border-none shadow-sm bg-white">
                        <CardContent>
                            {corretorNome ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        {corretorNome}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center">
                                    Sem corretor atribuído
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Imóveis Vinculados Section */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Home
                            className="h-5 w-5 text-gray-500"
                            aria-hidden="true"
                        />
                        Imóveis Vinculados ({imoveisVinculados.length})
                    </h2>
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle>
                                Imóveis Vinculados ({imoveisVinculados.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {imoveisVinculados.length > 0 ? (
                                imoveisVinculados.map((imovel) => (
                                    <Link
                                        to={`/imovel-detalhes/${imovel.id}`}
                                        key={imovel.id}
                                        className="block p-3 border rounded-lg hover:bg-gray-100"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-semibold text-blue-700">
                                                    {imovel.titulo}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {imovel.endereco.bairro},{" "}
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
                                                    {formatPrice(imovel.preco)}
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
                </section>
            </div>
        </div>
    );
}
