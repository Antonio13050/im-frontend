import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Home,
    DollarSign,
    Square,
    Bed,
    Bath,
    Car,
    Calendar,
    User as UserIcon,
    ArrowLeft,
    Phone,
    Mail,
    ImageIcon,
    Share2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchUsers } from "@/services/UserService";
import { fetchClientes } from "@/services/ClienteService";
import ShareModal from "@/components/imoveis/shareModal/ShareModal";

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

export default function ImovelDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imovel, setImovel] = useState(null);
    const [corretor, setCorretor] = useState(null);
    const [cliente, setCliente] = useState(null);
    const [todosClientes, setTodosClientes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false); // Estado para controlar o modal

    const loadImovelDetails = useCallback(async () => {
        try {
            if (!id) {
                console.error("ID do imóvel não encontrado");
                return;
            }

            const [imoveis, usuarios, clientes] = await Promise.all([
                fetchImoveis(),
                fetchUsers(),
                fetchClientes(),
            ]);
            setTodosClientes(clientes);
            const imovelData = imoveis.find((i) => String(i.id) === String(id));

            if (!imovelData) {
                console.error("Imóvel não encontrado");
                return;
            }

            setImovel(imovelData);
            if (imovelData.corretorId) {
                const corretorData = usuarios.find(
                    (u) => u.userId === imovelData.corretorId
                );
                setCorretor(corretorData);
            }

            if (imovelData.clienteId) {
                const clienteData = clientes.find(
                    (c) => c.id === imovelData.clienteId
                );
                setCliente(clienteData);
            }
        } catch (error) {
            console.error("Erro ao carregar detalhes do imóvel:", error);
        }
        setIsLoading(false);
    }, [id]);

    useEffect(() => {
        loadImovelDetails();
    }, [loadImovelDetails]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const getImageSrc = (foto) => {
        if (foto && foto.base64 && foto.tipoConteudo) {
            return `data:${foto.tipoConteudo};base64,${foto.base64}`;
        }
        return "/path/to/placeholder-image.jpg"; // Fallback image
    };

    const handleShareWhatsApp = () => {
        if (!imovel) return;

        const formattedPrice = formatPrice(imovel.preco);
        const propertyUrl = window.location.href;

        const details = [
            imovel.area && `- Área: ${imovel.area}m²`,
            imovel.quartos && `- Quartos: ${imovel.quartos}`,
            imovel.banheiros && `- Banheiros: ${imovel.banheiros}`,
            imovel.vagas && `- Vagas: ${imovel.vagas}`,
        ]
            .filter(Boolean)
            .join("\n");

        const message = `
Olá! Encontrei um imóvel que pode te interessar.

*${imovel.titulo}*

*Preço:* ${formattedPrice} ${imovel.finalidade === "aluguel" ? "/mês" : ""}

*Endereço:* ${imovel.endereco?.rua}, ${imovel.endereco?.numero} - ${
            imovel.endereco?.bairro
        }, ${imovel.endereco?.cidade}

*Detalhes:*
${details}

Veja mais fotos e informações no link:
${propertyUrl}

Fico à disposição!
    `.trim();

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            message
        )}`;
        window.open(whatsappUrl, "_blank");
    };

    const goBack = () => navigate(-1);

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (!imovel) {
        return (
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Imóvel não encontrado
                        </h3>
                        <p className="text-gray-500">
                            O imóvel que você está procurando não existe ou foi
                            removido
                        </p>
                        <Button onClick={goBack} className="mt-4">
                            Voltar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="outline"
                            onClick={goBack}
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>

                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {imovel.titulo}
                                </h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        {imovel.endereco?.rua},{" "}
                                        {imovel.endereco?.numero} -{" "}
                                        {imovel.endereco?.bairro},{" "}
                                        {imovel.endereco?.cidade}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {formatPrice(imovel.preco)}
                                    {imovel.finalidade === "aluguel" && (
                                        <span className="text-lg text-gray-500 font-normal">
                                            /mês
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Badge
                                        className={statusColors[imovel.status]}
                                    >
                                        {imovel.status}
                                    </Badge>
                                    <Badge variant="outline">
                                        {tipoLabels[imovel.tipo]}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="mb-6">
                                <CardContent className="p-4">
                                    {imovel.fotos && imovel.fotos.length > 0 ? (
                                        <div>
                                            <div className="h-96 bg-gray-100 rounded-t-lg overflow-hidden">
                                                <img
                                                    src={getImageSrc(
                                                        imovel.fotos[
                                                            selectedImage
                                                        ]
                                                    )}
                                                    alt={`${
                                                        imovel.titulo
                                                    } - Foto ${
                                                        selectedImage + 1
                                                    }`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error(
                                                            `Failed to load image for ${imovel.titulo}:`,
                                                            e
                                                        );
                                                        e.target.src =
                                                            "/path/to/placeholder-image.jpg";
                                                    }}
                                                />
                                            </div>
                                            {imovel.fotos.length > 1 && (
                                                <div className="p-4 bg-white rounded-b-lg">
                                                    <div className="grid grid-cols-6 gap-2">
                                                        {imovel.fotos.map(
                                                            (foto, index) => (
                                                                <button
                                                                    key={index}
                                                                    onClick={() =>
                                                                        setSelectedImage(
                                                                            index
                                                                        )
                                                                    }
                                                                    className={`h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                                        selectedImage ===
                                                                        index
                                                                            ? "border-blue-500"
                                                                            : "border-gray-200"
                                                                    }`}
                                                                >
                                                                    <img
                                                                        src={getImageSrc(
                                                                            foto
                                                                        )}
                                                                        alt={`Miniatura ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-500">
                                                    Nenhuma foto disponível
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Descrição */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Descrição do Imóvel</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {imovel.descricao ||
                                            "Nenhuma descrição disponível."}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Coluna Direita: Detalhes, Corretor e Cliente */}
                        <div className="space-y-8">
                            {/* Ações Rápidas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ações Rápidas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        className="w-full"
                                        onClick={() => setShowShareModal(true)} // Abre o modal
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Compartilhar com Cliente
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Detalhes</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Características */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {imovel.area && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Square className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Área
                                                    </p>
                                                    <p className="font-semibold">
                                                        {imovel.area}m²
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {imovel.quartos && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Bed className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Quartos
                                                    </p>
                                                    <p className="font-semibold">
                                                        {imovel.quartos}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {imovel.banheiros && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Bath className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Banheiros
                                                    </p>
                                                    <p className="font-semibold">
                                                        {imovel.banheiros}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {imovel.vagas && (
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <Car className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Vagas
                                                    </p>
                                                    <p className="font-semibold">
                                                        {imovel.vagas}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Separator for readability */}
                                    <hr className="border-t border-gray-200" />

                                    {/* Information (from old "Informações do Imóvel" card) */}
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Finalidade
                                        </p>
                                        <p className="font-semibold capitalize">
                                            {imovel.finalidade === "venda"
                                                ? "Venda"
                                                : "Aluguel"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Tipo
                                        </p>
                                        <p className="font-semibold">
                                            {tipoLabels[imovel.tipo]}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Status
                                        </p>
                                        <Badge
                                            className={
                                                statusColors[imovel.status]
                                            }
                                        >
                                            {imovel.status}
                                        </Badge>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Cadastrado em
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="font-semibold">
                                                {format(
                                                    new Date(
                                                        imovel.createdDate
                                                    ),
                                                    "dd/MM/yyyy",
                                                    { locale: ptBR }
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Corretor Responsável */}
                            {corretor && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <UserIcon className="w-5 h-5" />
                                            Corretor Responsável
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {corretor.full_name ||
                                                    corretor.email}
                                            </p>
                                            <p className="text-sm text-gray-500 capitalize">
                                                {corretor.perfil}
                                            </p>
                                        </div>

                                        {corretor.telefone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                <span>{corretor.telefone}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <span>{corretor.email}</span>
                                        </div>

                                        {corretor.creci && (
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    CRECI:
                                                </span>{" "}
                                                {corretor.creci}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Cliente Vinculado */}
                            {cliente &&
                                (imovel.status === "vendido" ||
                                    imovel.status === "alugado") && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                {imovel.status === "vendido"
                                                    ? "Comprador"
                                                    : "Inquilino"}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <UserIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <p className="font-semibold text-gray-900">
                                                    {cliente.nome}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                <span>{cliente.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4" />
                                                <span>{cliente.telefone}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Endereço Completo */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Localização
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <span className="font-medium">
                                                Rua:
                                            </span>{" "}
                                            {imovel.endereco?.rua},{" "}
                                            {imovel.endereco?.numero}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Bairro:
                                            </span>{" "}
                                            {imovel.endereco?.bairro}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Cidade:
                                            </span>{" "}
                                            {imovel.endereco?.cidade},{" "}
                                            {imovel.endereco?.estado}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                CEP:
                                            </span>{" "}
                                            {imovel.endereco?.cep}
                                        </p>

                                        {imovel.endereco?.latitude &&
                                            imovel.endereco?.longitude && (
                                                <div className="mt-4">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={() => {
                                                            const url = `https://www.google.com/maps?q=${imovel.endereco.latitude},${imovel.endereco.longitude}`;
                                                            window.open(
                                                                url,
                                                                "_blank"
                                                            );
                                                        }}
                                                    >
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        Ver no Google Maps
                                                    </Button>
                                                </div>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <ShareModal
                open={showShareModal}
                onClose={() => setShowShareModal(false)}
                imovel={imovel}
                clientes={todosClientes}
            />
        </>
    );
}
