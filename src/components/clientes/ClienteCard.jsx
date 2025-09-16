import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Trash2,
    User,
    DollarSign,
    Home,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function ClienteCard({
    cliente,
    onEdit,
    onDelete,
    canEdit,
    imoveisVinculados,
}) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const getFaixaPreco = () => {
        const { faixa_preco_min, faixa_preco_max } = cliente.interesses || {};
        if (!faixa_preco_min && !faixa_preco_max) return null;

        if (faixa_preco_min && faixa_preco_max) {
            return `${formatPrice(faixa_preco_min)} - ${formatPrice(
                faixa_preco_max
            )}`;
        }

        return faixa_preco_min
            ? `A partir de ${formatPrice(faixa_preco_min)}`
            : `Até ${formatPrice(faixa_preco_max)}`;
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-gray-900">
                                {cliente.nome}
                            </CardTitle>
                            {cliente.dataNascimento && (
                                <p className="text-sm text-gray-500">
                                    {format(
                                        new Date(cliente.dataNascimento),
                                        "dd/MM/yyyy",
                                        { locale: ptBR }
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    {canEdit && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onEdit(cliente)}
                                    className="h-7 w-7 p-0"
                                >
                                    <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onDelete(cliente.id)}
                                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Contato */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{cliente.telefone}</span>
                    </div>
                </div>

                {/* Interesses */}
                {cliente.interesses && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                            Interesses
                        </h4>

                        {cliente.interesses.tipos_imovel && (
                            <div className="flex flex-wrap gap-1">
                                {cliente.interesses.tipos_imovel.map(
                                    (tipo, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {tipo}
                                        </Badge>
                                    )
                                )}
                            </div>
                        )}

                        {getFaixaPreco() && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <DollarSign className="w-4 h-4" />
                                <span>{getFaixaPreco()}</span>
                            </div>
                        )}

                        {cliente.interesses.bairros_interesse &&
                            cliente.interesses.bairros_interesse.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                        {cliente.interesses.bairros_interesse.join(
                                            ", "
                                        )}
                                    </span>
                                </div>
                            )}

                        {cliente.interesses.finalidade && (
                            <Badge
                                className={
                                    cliente.interesses.finalidade === "venda"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                }
                            >
                                {cliente.interesses.finalidade === "venda"
                                    ? "Compra"
                                    : "Aluguel"}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Imóveis Vinculados */}
                {imoveisVinculados && imoveisVinculados.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            <Home className="w-4 h-4" /> Imóveis Vinculados
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {imoveisVinculados.map((imovel) => (
                                <Link to={`/imovel-detalhes/${imovel.id}`}>
                                    <Badge
                                        variant="secondary"
                                        className="hover:bg-gray-300"
                                    >
                                        {imovel.titulo}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Observações */}
                {cliente.observacoes && (
                    <div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {cliente.observacoes}
                        </p>
                    </div>
                )}

                {/* Data de cadastro */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                    <Calendar className="w-3 h-3" />
                    <span>
                        Cadastrado em{" "}
                        {format(new Date(cliente.createdDate), "dd/MM/yyyy", {
                            locale: ptBR,
                        })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
