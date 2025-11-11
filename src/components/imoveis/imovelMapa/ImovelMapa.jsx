import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, DollarSign, Square } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

function UpdateMapCenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && map) {
            map.flyTo(center, 12, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

export default function ImovelMapa({ imoveis }) {
    const [center, setCenter] = useState([-23.5505, -46.6333]);

    useEffect(() => {
        if (imoveis?.length > 0) {
            const lats = imoveis
                .map((i) => i.endereco?.latitude)
                .filter(Boolean);
            const lngs = imoveis
                .map((i) => i.endereco?.longitude)
                .filter(Boolean);

            if (lats.length > 0 && lngs.length > 0) {
                const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
                const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
                setCenter([centerLat, centerLng]);
            }
        }
    }, [imoveis]);

    const imoveisNoMapa = imoveis.filter(
        (i) => i.endereco?.latitude && i.endereco?.longitude
    );

    const formatPrice = (price) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);

    return (
        <div className="bg-gray-50 rounded-xl">
            <Card className="p-0 overflow-hidden shadow-lg">
                <CardContent className="p-0 relative">
                    <div className="h-[600px] w-full rounded-lg overflow-hidden">
                        <MapContainer
                            key={center.join(",")}
                            center={center}
                            zoom={12}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <UpdateMapCenter center={center} />

                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {imoveisNoMapa.map((imovel) => (
                                <Marker
                                    key={imovel.id}
                                    position={[
                                        imovel.endereco.latitude,
                                        imovel.endereco.longitude,
                                    ]}
                                >
                                    <Popup minWidth={300}>
                                        <div className="p-2">
                                            {imovel.fotos?.length > 0 && (
                                                <img
                                                    src={imovel.fotos[0]}
                                                    alt={imovel.titulo}
                                                    className="w-full h-32 object-cover rounded-lg mb-3"
                                                />
                                            )}

                                            <h3 className="font-bold text-lg mb-2 text-gray-900">
                                                {imovel.titulo}
                                            </h3>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-600">
                                                        {imovel.endereco.rua},{" "}
                                                        {imovel.endereco.numero}{" "}
                                                        -{" "}
                                                        {imovel.endereco.bairro}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                                    <span className="font-semibold text-blue-600">
                                                        {formatPrice(
                                                            imovel.preco
                                                        )}
                                                        {imovel.finalidade ===
                                                            "aluguel" && (
                                                            <span className="text-sm font-normal">
                                                                /mês
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>

                                                {imovel.area && (
                                                    <div className="flex items-center gap-2">
                                                        <Square className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm text-gray-600">
                                                            {imovel.area}m²
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-3">
                                                    <Badge
                                                        className={
                                                            statusColors[
                                                                imovel.status
                                                            ]
                                                        }
                                                    >
                                                        {imovel.status}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {
                                                            tipoLabels[
                                                                imovel.tipo
                                                            ]
                                                        }
                                                    </Badge>
                                                </div>

                                                {imovel.descricao && (
                                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                        {imovel.descricao}
                                                    </p>
                                                )}

                                                <div className="mt-4 pt-3 border-t border-gray-200">
                                                    <Link
                                                        to={`/imovel-detalhes/${imovel.id}`}
                                                        className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                                    >
                                                        Ver Detalhes Completos
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>

                    {/* Estatísticas no canto */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 z-[1000]">
                        <div className="flex items-center gap-2 mb-2">
                            <Home className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                                {imoveisNoMapa.length} imóveis no mapa
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div>
                                {
                                    imoveis.filter(
                                        (i) => i.status === "disponivel"
                                    ).length
                                }{" "}
                                disponíveis
                            </div>
                            <div>
                                {
                                    imoveis.filter(
                                        (i) => i.finalidade === "venda"
                                    ).length
                                }{" "}
                                à venda
                            </div>
                            <div>
                                {
                                    imoveis.filter(
                                        (i) => i.finalidade === "aluguel"
                                    ).length
                                }{" "}
                                para aluguel
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {imoveisNoMapa.length === 0 && (
                <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum imóvel encontrado
                    </h3>
                    <p className="text-gray-500">
                        {imoveis.length === 0
                            ? "Cadastre imóveis com coordenadas para visualizá-los no mapa"
                            : "Tente ajustar os filtros ou adicione coordenadas aos imóveis"}
                    </p>
                </div>
            )}
        </div>
    );
}
