import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Square,
    Calendar,
    Edit,
    Trash2,
    ImageIcon,
    User,
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

export default function ImovelCard({
    imovel,
    onEdit,
    onDelete,
    canEdit,
    clienteNome,
}) {
    console.log(clienteNome);
    const formatPrice = (price) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const getMainImage = () => {
        if (
            imovel.fotos &&
            imovel.fotos.length > 0 &&
            imovel.fotos[0].base64 &&
            imovel.fotos[0].tipoConteudo
        ) {
            return `data:${imovel.fotos[0].tipoConteudo};base64,${imovel.fotos[0].base64}`;
        }
        return null;
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative h-48 bg-gray-100">
                {getMainImage() ? (
                    <img
                        src={getMainImage()}
                        alt={imovel.fotos[0]?.nomeArquivo || imovel.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error(
                                `Failed to load image for ${imovel.titulo}:`,
                                e
                            );
                            e.target.src = "/path/to/placeholder-image.jpg"; // Fallback image
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge
                        className={
                            statusColors[imovel.status] ||
                            "bg-gray-100 text-gray-800"
                        }
                    >
                        {imovel.status}
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                        {tipoLabels[imovel.tipo] || imovel.tipo}
                    </Badge>
                </div>

                {imovel.fotos && imovel.fotos.length > 1 && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white">
                            +{imovel.fotos.length - 1}
                        </Badge>
                    </div>
                )}

                {canEdit && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(imovel);
                                }}
                                className="h-7 w-7 p-0"
                            >
                                <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(imovel.id);
                                }}
                                className="h-7 w-7 p-0"
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <CardHeader className="pb-3">
                <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                        {imovel.titulo}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">
                            {imovel.endereco?.bairro}, {imovel.endereco?.cidade}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-4">
                    <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(imovel.preco)}
                        {imovel.finalidade === "aluguel" && (
                            <span className="text-sm text-gray-500 font-normal">
                                /mês
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                        {imovel.area && (
                            <div className="flex items-center gap-1">
                                <Square className="w-4 h-4" />
                                <span>{imovel.area}m²</span>
                            </div>
                        )}
                        {imovel.quartos && (
                            <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4" />
                                <span>{imovel.quartos}</span>
                            </div>
                        )}
                        {imovel.banheiros && (
                            <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4" />
                                <span>{imovel.banheiros}</span>
                            </div>
                        )}
                        {imovel.vagas && (
                            <div className="flex items-center gap-1">
                                <Car className="w-4 h-4" />
                                <span>{imovel.vagas}</span>
                            </div>
                        )}
                    </div>
                    {clienteNome &&
                        (imovel.status === "vendido" ||
                            imovel.status === "alugado") && (
                            <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-800 p-2 rounded-lg">
                                <User className="w-4 h-4" />
                                <span>
                                    {imovel.status === "vendido"
                                        ? "Vendido para:"
                                        : "Alugado para:"}{" "}
                                    <strong>{clienteNome}</strong>
                                </span>
                            </div>
                        )}
                    {imovel.descricao && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {imovel.descricao}
                        </p>
                    )}
                </div>
                {/* Data de cadastro */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                    <Calendar className="w-3 h-3" />
                    <span>
                        Cadastrado em{" "}
                        {format(new Date(imovel.createdDate), "dd/MM/yyyy", {
                            locale: ptBR,
                        })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
