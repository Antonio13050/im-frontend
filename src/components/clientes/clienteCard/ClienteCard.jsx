import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    User,
    DollarSign,
    Home,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import ClienteActions from "./ClienteActions";

const InfoItem = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon className="w-4 h-4" />
        {children}
    </div>
);

const ClienteCard = memo(function ClienteCard({
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
        const { faixaPrecoMin, faixaPrecoMax } = cliente.interesses || {};
        if (!faixaPrecoMin && !faixaPrecoMax) return null;

        if (faixaPrecoMin && faixaPrecoMax) {
            return `${formatPrice(faixaPrecoMin)} - ${formatPrice(
                faixaPrecoMax
            )}`;
        }

        return faixaPrecoMin
            ? `A partir de ${formatPrice(faixaPrecoMin)}`
            : `Até ${formatPrice(faixaPrecoMax)}`;
    };

    const faixaPreco = getFaixaPreco();

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
                                        {
                                            locale: ptBR,
                                        }
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    <ClienteActions
                        canEdit={canEdit}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        cliente={cliente}
                    />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <InfoItem icon={Mail}>{cliente.email}</InfoItem>
                    <InfoItem icon={Phone}>{cliente.telefone}</InfoItem>
                </div>

                {cliente.interesses && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                            Interesses
                        </h4>

                        {cliente.interesses.tiposImovel && (
                            <div className="flex flex-wrap gap-1">
                                {cliente.interesses.tiposImovel.map(
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

                        {faixaPreco && (
                            <InfoItem icon={DollarSign}>
                                <span>{faixaPreco}</span>
                            </InfoItem>
                        )}

                        {cliente.interesses.bairrosInteresse &&
                            cliente.interesses.bairrosInteresse.length > 0 && (
                                <InfoItem icon={MapPin}>
                                    <span>
                                        {cliente.interesses.bairrosInteresse.join(
                                            ", "
                                        )}
                                    </span>
                                </InfoItem>
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

                {imoveisVinculados.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                            <Home className="w-4 h-4" /> Imóveis Vinculados
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {imoveisVinculados.map((imovel) => (
                                <Link
                                    key={imovel.id}
                                    to={`/imovel-detalhes/${imovel.id}`}
                                >
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

                {cliente.observacoes && (
                    <div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {cliente.observacoes}
                        </p>
                    </div>
                )}

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
});

export default ClienteCard;
