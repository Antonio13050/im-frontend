import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, Home, DollarSign, Square, Filter } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchImoveis } from "@/services/ImovelService";

// Fix for default markers in react-leaflet
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

export default function Mapa() {
    const [allImoveis, setAllImoveis] = useState([]);
    const [filteredImoveis, setFilteredImoveis] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [center, setCenter] = useState([-23.5505, -46.6333]); // São Paulo como padrão
    const [filters, setFilters] = useState({
        status: "todos",
        tipo: "todos",
        finalidade: "todos",
    });

    const applyFilters = useCallback(() => {
        let filtered = [...allImoveis];

        // Filtrar por status
        if (filters.status !== "todos") {
            filtered = filtered.filter(
                (imovel) => imovel.status === filters.status
            );
        }

        // Filtrar por tipo
        if (filters.tipo !== "todos") {
            filtered = filtered.filter(
                (imovel) => imovel.tipo === filters.tipo
            );
        }

        // Filtrar por finalidade
        if (filters.finalidade !== "todos") {
            filtered = filtered.filter(
                (imovel) => imovel.finalidade === filters.finalidade
            );
        }

        setFilteredImoveis(filtered);
    }, [allImoveis, filters]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const imoveisData = await fetchImoveis();
            setAllImoveis(imoveisData);

            // Definir centro do mapa baseado nos imóveis
            if (imoveisData.length > 0) {
                const lats = imoveisData
                    .map((i) => i.endereco?.latitude)
                    .filter(Boolean);
                const lngs = imoveisData
                    .map((i) => i.endereco?.longitude)
                    .filter(Boolean);

                if (lats.length > 0 && lngs.length > 0) {
                    const centerLat =
                        lats.reduce((a, b) => a + b, 0) / lats.length;
                    const centerLng =
                        lngs.reduce((a, b) => a + b, 0) / lngs.length;
                    setCenter([centerLat, centerLng]);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
        setIsLoading(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const imoveisNoMapa = filteredImoveis.filter(
        (imovel) => imovel.endereco?.latitude && imovel.endereco?.longitude
    );

    const imoveisSemCoordenadas = filteredImoveis.filter(
        (imovel) => !imovel.endereco?.latitude || !imovel.endereco?.longitude
    );

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Mapa de Imóveis
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Visualize a localização de todos os imóveis cadastrados
                    </p>
                </div>

                {/* Filtros */}
                <Card className="mb-6 py-0">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Filtros:
                                </span>
                            </div>

                            <Select
                                value={filters.status}
                                className="z-[9999]"
                                onValueChange={(value) =>
                                    handleFilterChange("status", value)
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">
                                        Todos Status
                                    </SelectItem>
                                    <SelectItem value="disponivel">
                                        Disponível
                                    </SelectItem>
                                    <SelectItem value="vendido">
                                        Vendido
                                    </SelectItem>
                                    <SelectItem value="alugado">
                                        Alugado
                                    </SelectItem>
                                    <SelectItem value="reservado">
                                        Reservado
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.tipo}
                                onValueChange={(value) =>
                                    handleFilterChange("tipo", value)
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">
                                        Todos Tipos
                                    </SelectItem>
                                    <SelectItem value="casa">Casa</SelectItem>
                                    <SelectItem value="apartamento">
                                        Apartamento
                                    </SelectItem>
                                    <SelectItem value="terreno">
                                        Terreno
                                    </SelectItem>
                                    <SelectItem value="comercial">
                                        Comercial
                                    </SelectItem>
                                    <SelectItem value="galpao">
                                        Galpão
                                    </SelectItem>
                                    <SelectItem value="chacara">
                                        Chácara
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.finalidade}
                                onValueChange={(value) =>
                                    handleFilterChange("finalidade", value)
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todas</SelectItem>
                                    <SelectItem value="venda">Venda</SelectItem>
                                    <SelectItem value="aluguel">
                                        Aluguel
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Alertas */}
                {imoveisSemCoordenadas.length > 0 && (
                    <Card className="mb-6 border-yellow-200 bg-yellow-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-yellow-800">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">
                                    {imoveisSemCoordenadas.length} imóveis não
                                    aparecem no mapa
                                </span>
                            </div>
                            <p className="text-sm text-yellow-700 mt-1">
                                Estes imóveis não possuem coordenadas
                                cadastradas. Edite-os para adicionar latitude e
                                longitude.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card className="overflow-hidden shadow-lg py-0">
                    <CardContent className="p-0">
                        <div className="relative z-0">
                            <div
                                className="h-[600px] w-full rounded-lg overflow-hidden"
                                style={{ minHeight: "600px" }}
                            >
                                <MapContainer
                                    center={center}
                                    zoom={12}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                                            <Popup
                                                className="custom-popup"
                                                minWidth={300}
                                            >
                                                <div className="p-2">
                                                    {imovel.fotos &&
                                                        imovel.fotos.length >
                                                            0 && (
                                                            <img
                                                                src={
                                                                    imovel
                                                                        .fotos[0]
                                                                }
                                                                alt={
                                                                    imovel.titulo
                                                                }
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
                                                                {
                                                                    imovel
                                                                        .endereco
                                                                        .rua
                                                                }
                                                                ,{" "}
                                                                {
                                                                    imovel
                                                                        .endereco
                                                                        .numero
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    imovel
                                                                        .endereco
                                                                        .bairro
                                                                }
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
                                                                    {
                                                                        imovel.area
                                                                    }
                                                                    m²
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between mt-3">
                                                            <Badge
                                                                className={
                                                                    statusColors[
                                                                        imovel
                                                                            .status
                                                                    ]
                                                                }
                                                            >
                                                                {imovel.status}
                                                            </Badge>

                                                            <Badge variant="outline">
                                                                {
                                                                    tipoLabels[
                                                                        imovel
                                                                            .tipo
                                                                    ]
                                                                }
                                                            </Badge>
                                                        </div>

                                                        {imovel.descricao && (
                                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                                {
                                                                    imovel.descricao
                                                                }
                                                            </p>
                                                        )}

                                                        {/* Botão para ver detalhes */}
                                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                                            <Link
                                                                to={`/imovel-detalhes/${imovel.id}`}
                                                                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                                            >
                                                                Ver Detalhes
                                                                Completos
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>

                            {/* Stats overlay */}
                            <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Home className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-gray-900">
                                        {imoveisNoMapa.length} imóveis no mapa
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div>
                                        {
                                            filteredImoveis.filter(
                                                (i) => i.status === "disponivel"
                                            ).length
                                        }{" "}
                                        disponíveis
                                    </div>
                                    <div>
                                        {
                                            filteredImoveis.filter(
                                                (i) => i.finalidade === "venda"
                                            ).length
                                        }{" "}
                                        para venda
                                    </div>
                                    <div>
                                        {
                                            filteredImoveis.filter(
                                                (i) =>
                                                    i.finalidade === "aluguel"
                                            ).length
                                        }{" "}
                                        para aluguel
                                    </div>
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
                            {allImoveis.length === 0
                                ? "Cadastre imóveis com coordenadas para visualizá-los no mapa"
                                : "Tente ajustar os filtros ou adicione coordenadas aos imóveis"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
