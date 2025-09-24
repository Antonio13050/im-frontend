import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Bed,
    Bath,
    Car,
    Square,
    Calendar,
    ImageIcon,
    User,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ImovelBadges from "./ImovelBadges";
import ImovelActions from "./ImovelActions";

const InfoItem = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-1">
        <Icon className="w-4 h-4" />
        <span>{children}</span>
    </div>
);

const ImovelCard = memo(function ImovelCard({
    imovel,
    onEdit,
    onDelete,
    canEdit,
    clienteNome,
    corretorNome,
}) {
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
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
            <div className="relative">
                <Link
                    to={`/imovel-detalhes/${imovel.id}`}
                    className="block h-48 bg-gray-100"
                >
                    {getMainImage() ? (
                        <img
                            src={getMainImage()}
                            alt={`${imovel.titulo} - Foto principal`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = "/path/to/placeholder-image.jpg";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-300" />
                        </div>
                    )}
                </Link>

                <ImovelBadges imovel={imovel} />

                {imovel.fotos && imovel.fotos.length > 1 && (
                    <div className="absolute bottom-3 right-3">
                        <Badge
                            variant="secondary"
                            className="bg-black/50 text-white"
                        >
                            +{imovel.fotos.length - 1} fotos
                        </Badge>
                    </div>
                )}

                <ImovelActions
                    canEdit={canEdit}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    imovel={imovel}
                />
            </div>

            <div className="flex-grow flex flex-col p-4 space-y-3">
                <div className="space-y-1">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                        <Link
                            to={`/imovel-detalhes/${imovel.id}`}
                            className="hover:underline"
                        >
                            {imovel.titulo}
                        </Link>
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">
                            {imovel.endereco?.bairro}, {imovel.endereco?.cidade}
                        </span>
                    </div>
                </div>

                <div className="flex-grow space-y-3">
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
                            <InfoItem icon={Square}>{imovel.area}m²</InfoItem>
                        )}
                        {imovel.quartos && (
                            <InfoItem icon={Bed}>{imovel.quartos}</InfoItem>
                        )}
                        {imovel.banheiros && (
                            <InfoItem icon={Bath}>{imovel.banheiros}</InfoItem>
                        )}
                        {imovel.vagas && (
                            <InfoItem icon={Car}>{imovel.vagas}</InfoItem>
                        )}
                    </div>
                </div>

                <div className="pt-3 border-t space-y-1">
                    {corretorNome && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>{corretorNome}</span>
                        </div>
                    )}
                    {clienteNome &&
                        (imovel.status === "vendido" ||
                            imovel.status === "alugado") && (
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4" />
                                <span>
                                    {imovel.status === "vendido"
                                        ? "Vendido p/ "
                                        : "Alugado p/ "}
                                </span>
                                <Link
                                    to={`/cliente-detalhes/${imovel.clienteId}`}
                                    className="font-bold text-blue-700 hover:underline"
                                >
                                    <strong>{clienteNome}</strong>
                                </Link>
                            </div>
                        )}
                    {imovel.descricao && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {imovel.descricao}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                    <Calendar className="w-3 h-3" />
                    <span>
                        Cadastrado em{" "}
                        {format(new Date(imovel.createdDate), "dd/MM/yyyy", {
                            locale: ptBR,
                        })}
                    </span>
                </div>
            </div>
        </Card>
    );
});

export default ImovelCard;
