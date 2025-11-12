import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Square,
    Edit,
    Trash2,
    Calendar,
    ImageIcon,
    User,
    Eye,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusColors = {
    disponivel: "bg-green-100 text-green-800",
    vendido: "bg-blue-100 text-blue-800",
    alugado: "bg-yellow-100 text-yellow-800",
    reservado: "bg-red-100 text-red-800",
};

const tipoLabels = {
    casa: "Casa",
    apartamento: "Apartamento",
    terreno: "Terreno",
    comercial: "Comercial",
    galpao: "Galpão",
    chacara: "Chácara",
};

const ImovelListItens = memo(function ImovelCard({
    imovel,
    onEdit,
    onDelete,
    canEdit,
    clienteNome,
    corretorNome,
}) {
    const formatPrice = (price) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);

    const getMainImage = () => {
        if (
            imovel.fotos?.length > 0 &&
            imovel.fotos[0].base64 &&
            imovel.fotos[0].tipoConteudo
        ) {
            return `data:${imovel.fotos[0].tipoConteudo};base64,${imovel.fotos[0].base64}`;
        }
        return null;
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-all duration-200 group py-1">
            <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row h-full">
                    {/* Imagem do Imóvel */}
                    <div className="relative w-full sm:w-64 aspect-[4/3] flex-shrink-0 overflow-hidden bg-gray-100">
                        <Link
                            to={`/imovel-detalhes/${imovel.id}`}
                            className="block w-full h-full"
                        >
                            {getMainImage() ? (
                                <img
                                    src={getMainImage()}
                                    alt={`${imovel.titulo} - Foto principal`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-image.jpg";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                        </Link>

                        {imovel.fotos?.length > 1 && (
                            <div className="absolute bottom-2 right-2">
                                <Badge
                                    variant="secondary"
                                    className="bg-black/60 text-white text-xs"
                                >
                                    +{imovel.fotos.length - 1} fotos
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 px-4 flex flex-col justify-between min-w-0">
                        <div className="space-y-4">
                            {/* Cabeçalho */}
                            <div className="flex justify-between items-start gap-2 sm:gap-3">
                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/imovel-detalhes/${imovel.id}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-gray-900 truncate">
                                            {imovel.titulo}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center text-gray-700 text-sm mt-1">
                                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0 text-gray-500" />
                                        <span className="truncate">
                                            {imovel.endereco?.rua},{" "}
                                            {imovel.endereco?.numero} -{" "}
                                            {imovel.endereco?.bairro},{" "}
                                            {imovel.endereco?.cidade}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
                                    <Badge
                                        className={
                                            statusColors[imovel.status] ||
                                            "bg-gray-100 text-gray-800"
                                        }
                                    >
                                        {imovel.status}
                                    </Badge>
                                    <Badge variant="outline">
                                        {tipoLabels[imovel.tipo] || imovel.tipo}
                                    </Badge>
                                </div>
                            </div>

                            {/* Características */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {imovel.area && (
                                    <div className="flex items-center gap-1">
                                        <Square className="w-4 h-4 text-gray-500" />
                                        <span>{imovel.area}m²</span>
                                    </div>
                                )}
                                {imovel.quartos && (
                                    <div className="flex items-center gap-1">
                                        <Bed className="w-4 h-4 text-gray-500" />
                                        <span>{imovel.quartos} quartos</span>
                                    </div>
                                )}
                                {imovel.banheiros && (
                                    <div className="flex items-center gap-1">
                                        <Bath className="w-4 h-4 text-gray-500" />
                                        <span>
                                            {imovel.banheiros} banheiros
                                        </span>
                                    </div>
                                )}
                                {imovel.vagas && (
                                    <div className="flex items-center gap-1">
                                        <Car className="w-4 h-4 text-gray-500" />
                                        <span>{imovel.vagas} vagas</span>
                                    </div>
                                )}
                            </div>

                            {/* Corretor e Cliente */}
                            <div className="space-y-1 text-sm">
                                {corretorNome && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                        <span className="text-gray-500">
                                            Corretor:
                                        </span>
                                        <span className="font-medium truncate">
                                            {corretorNome}
                                        </span>
                                    </div>
                                )}
                                {clienteNome &&
                                    (imovel.status === "vendido" ||
                                        imovel.status === "alugado") && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            <span className="text-gray-500">
                                                {imovel.status === "vendido"
                                                    ? "Comprador:"
                                                    : "Inquilino:"}
                                            </span>
                                            <Link
                                                to={`/imovel-detalhes/${imovel.id}`}
                                                className="font-medium text-blue-700 hover:underline truncate"
                                            >
                                                {clienteNome}
                                            </Link>
                                        </div>
                                    )}
                            </div>
                            <div className="flex items-center text-xs gap-2 text-gray-700">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span className="text-gray-500">
                                    Cadastrado em{" "}
                                    {format(
                                        new Date(imovel.createdDate),
                                        "dd/MM/yyyy",
                                        {
                                            locale: ptBR,
                                        }
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Rodapé */}
                        <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                            <div className="text-2xl font-bold text-blue-600">
                                {formatPrice(imovel.preco)}
                                {imovel.finalidade === "aluguel" && (
                                    <span className="text-sm text-gray-500 font-normal">
                                        /mês
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <Link to={`/imovel-detalhes/${imovel.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Eye className="w-4 h-4 mr-1" />
                                        Ver Detalhes
                                    </Button>
                                </Link>

                                {canEdit && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                                            onClick={() => onEdit(imovel.id)}
                                            aria-label="Editar imóvel"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onDelete(imovel.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            aria-label="Excluir imóvel"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

export default ImovelListItens;
