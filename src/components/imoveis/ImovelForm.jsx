import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Upload,
    X,
    ImageIcon,
    MapPin,
    Search,
    Loader2,
    User,
} from "lucide-react";
import { getCoordinates } from "@/services/GeocodeService";
import { toast } from "sonner";
import { fetchClientes } from "@/services/ClienteService";

export default function ImovelForm({
    imovel,
    onSave,
    onCancel,
    currentUser,
    corretores,
}) {
    const [formData, setFormData] = useState({
        id: imovel?.id || "",
        titulo: imovel?.titulo || "",
        descricao: imovel?.descricao || "",
        tipo: imovel?.tipo || "casa",
        finalidade: imovel?.finalidade || "venda",
        endereco: {
            rua: imovel?.endereco?.rua || "",
            numero: imovel?.endereco?.numero || "",
            bairro: imovel?.endereco?.bairro || "",
            cidade: imovel?.endereco?.cidade || "",
            estado: imovel?.endereco?.estado || "",
            cep: imovel?.endereco?.cep || "",
            latitude: imovel?.endereco?.latitude || "",
            longitude: imovel?.endereco?.longitude || "",
        },
        preco: imovel?.preco || "",
        area: imovel?.area || "",
        quartos: imovel?.quartos || "",
        banheiros: imovel?.banheiros || "",
        vagas: imovel?.vagas || "",
        status: imovel?.status || "disponivel",
        fotos:
            imovel?.fotos?.map((foto) => ({
                id: foto.id,
                nomeArquivo: foto.nomeArquivo,
                dados: `data:${foto.tipoConteudo};base64,${foto.base64}`,
                tipoConteudo: foto.tipoConteudo,
                file: null,
            })) || [],
        clienteId: imovel?.clienteId ? String(imovel.clienteId) : "",
        corretorId: imovel?.corretorId
            ? String(imovel.corretorId)
            : String(currentUser?.sub),
    });

    const [clientes, setClientes] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [isBuscandoCep, setIsBuscandoCep] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        const loadClientes = async () => {
            try {
                const clientesData = await fetchClientes();
                setClientes(clientesData ?? []);
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            }
        };
        loadClientes();
    }, []);

    const handleInputChange = (field, value) => {
        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const buscarEnderecoPorCep = async (cep) => {
        if (cep.length !== 8) return;

        setIsBuscandoCep(true);
        try {
            const response = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );
            const data = await response.json();

            if (!data.erro) {
                setFormData((prev) => ({
                    ...prev,
                    endereco: {
                        ...prev.endereco,
                        rua: data.logradouro || prev.endereco.rua,
                        bairro: data.bairro || prev.endereco.bairro,
                        cidade: data.localidade || prev.endereco.cidade,
                        estado: data.uf || prev.endereco.estado,
                        cep: cep,
                    },
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
        setIsBuscandoCep(false);
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const newFotos = files.map((file) => ({
                id: null,
                nomeArquivo: file.name,
                dados: URL.createObjectURL(file),
                file: file,
            }));

            setFormData((prev) => ({
                ...prev,
                fotos: [...prev.fotos, ...newFotos],
            }));

            toast.success("Fotos selecionadas com sucesso!");
        } catch (error) {
            console.error("Erro ao processar imagens:", error);
            toast.error("Erro ao processar fotos. Tente novamente.");
        }
        setIsUploading(false);
    };

    const removeImage = async (index) => {
        setFormData((prev) => ({
            ...prev,
            fotos: prev.fotos.filter((_, i) => i !== index),
        }));
        toast.success("Foto removida com sucesso!");
    };

    const buscarCoordenadas = async () => {
        const { rua, numero, bairro, cidade, estado } = formData.endereco;

        const enderecoCompleto = `${rua}${numero ? ", " + numero : ""}${
            bairro ? ", " + bairro : ""
        }, ${cidade}, ${estado}`;

        if (!rua || !numero || !cidade || !estado) {
            toast.error(
                "Preencha pelo menos rua, número, cidade e estado para buscar coordenadas"
            );
            return;
        }

        try {
            setIsGeocoding(true);

            const data = await getCoordinates(enderecoCompleto);
            if (data.latitude && data.longitude) {
                setFormData((prev) => ({
                    ...prev,
                    endereco: {
                        ...prev.endereco,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    },
                }));
            } else {
                toast.error(
                    "Não foi possível obter as coordenadas. Tente inserir manualmente."
                );
            }
        } catch (error) {
            console.error("Erro ao buscar coordenadas:", error);
            toast.error(
                "Erro ao buscar coordenadas. Tente inserir manualmente."
            );
        } finally {
            setIsGeocoding(false);
        }
    };

    const formatCep = (value) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 5) {
            return cleaned;
        }
        return cleaned.replace(/(\d{5})(\d{0,3})/, "$1-$2");
    };

    const handleCepChange = (e) => {
        const formatted = formatCep(e.target.value);
        handleInputChange("endereco.cep", formatted);

        const cleanCep = formatted.replace(/\D/g, "");
        if (/^\d{8}$/.test(cleanCep)) {
            buscarEnderecoPorCep(cleanCep);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.endereco.latitude || !formData.endereco.longitude) {
            toast.error(
                'As coordenadas (latitude e longitude) são obrigatórias para que o imóvel apareça no mapa. Use o botão "Buscar Coordenadas".'
            );
            return;
        }

        setIsSubmitting(true);

        const dataToSubmit = {
            ...formData,
            preco: parseFloat(formData.preco) || 0,
            area: parseFloat(formData.area) || null,
            quartos: parseInt(formData.quartos) || null,
            banheiros: parseInt(formData.banheiros) || null,
            vagas: parseInt(formData.vagas) || null,
            clienteId: formData.clienteId === "" ? null : formData.clienteId,
            corretorId: formData.corretorId === "" ? null : formData.corretorId,
            endereco: {
                ...formData.endereco,
                latitude: parseFloat(formData.endereco.latitude),
                longitude: parseFloat(formData.endereco.longitude),
            },
            fotos: formData.fotos.map((foto) => ({
                id: foto.id,
                nomeArquivo: foto.nomeArquivo,
                tipoConteudo: foto.tipoConteudo,
            })),
        };

        const formDataToSend = new FormData();
        formDataToSend.append(
            "imovel",
            new Blob([JSON.stringify(dataToSubmit)], {
                type: "application/json",
            })
        );

        formData.fotos.forEach((foto) => {
            if (foto.file) {
                formDataToSend.append("fotos", foto.file);
            }
        });

        try {
            await onSave(formDataToSend);
        } catch (error) {
            console.error("Erro ao salvar imóvel:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {imovel ? "Editar Imóvel" : "Novo Imóvel"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Título *</Label>
                            <Input
                                value={formData.titulo}
                                onChange={(e) =>
                                    handleInputChange("titulo", e.target.value)
                                }
                                placeholder="Ex: Casa 3 quartos no Centro"
                                required
                            />
                        </div>

                        <div>
                            <Label>Tipo *</Label>
                            <Select
                                value={formData.tipo}
                                onValueChange={(value) =>
                                    handleInputChange("tipo", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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
                        </div>

                        <div>
                            <Label>Finalidade *</Label>
                            <Select
                                value={formData.finalidade}
                                onValueChange={(value) =>
                                    handleInputChange("finalidade", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="venda">Venda</SelectItem>
                                    <SelectItem value="aluguel">
                                        Aluguel
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    handleInputChange("status", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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
                        </div>
                    </div>

                    {(currentUser.scope === "ADMIN" ||
                        currentUser.scope === "GERENTE") && (
                        <div>
                            <Label className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Corretor
                                Responsável
                            </Label>
                            <Select
                                value={formData.corretorId}
                                onValueChange={(value) =>
                                    handleInputChange("corretorId", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um corretor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>Nenhum</SelectItem>
                                    {corretores.map((c) => (
                                        <SelectItem
                                            key={c.userId}
                                            value={String(c.userId)}
                                        >
                                            {c.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {(formData.status === "vendido" ||
                        formData.status === "alugado") && (
                        <div>
                            <Label>Cliente Vinculado</Label>
                            <Select
                                value={formData.clienteId}
                                onValueChange={(value) =>
                                    handleInputChange("clienteId", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>Nenhum</SelectItem>
                                    {clientes.map((cliente) => (
                                        <SelectItem
                                            key={cliente.id}
                                            value={String(cliente.id)}
                                        >
                                            {cliente.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-blue-600 mt-1">
                                💡 Vincule o cliente que comprou ou alugou este
                                imóvel.
                            </p>
                        </div>
                    )}

                    <div>
                        <Label>Descrição</Label>
                        <Textarea
                            value={formData.descricao}
                            onChange={(e) =>
                                handleInputChange("descricao", e.target.value)
                            }
                            placeholder="Descreva as características do imóvel..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">
                                Endereço *
                            </Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => buscarCoordenadas()}
                                disabled={isGeocoding}
                                className="flex items-center gap-2"
                            >
                                {isGeocoding ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Buscando...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        Buscar Coordenadas
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <Label>CEP *</Label>
                                <div className="relative">
                                    <Input
                                        value={formData.endereco.cep}
                                        onChange={handleCepChange}
                                        placeholder="00000-000"
                                        maxLength={9}
                                        required
                                    />
                                    {isBuscandoCep && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                    💡 Preencha o CEP para busca automática do
                                    endereço
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <Label>Rua *</Label>
                                <Input
                                    value={formData.endereco.rua}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endereco.rua",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nome da rua"
                                    required
                                />
                            </div>

                            <div>
                                <Label>Número</Label>
                                <Input
                                    value={formData.endereco.numero}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endereco.numero",
                                            e.target.value
                                        )
                                    }
                                    placeholder="123"
                                />
                            </div>
                            <div>
                                <Label>Bairro *</Label>
                                <Input
                                    value={formData.endereco.bairro}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endereco.bairro",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nome do bairro"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Cidade *</Label>
                                <Input
                                    value={formData.endereco.cidade}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endereco.cidade",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nome da cidade"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Estado *</Label>
                                <Input
                                    value={formData.endereco.estado}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endereco.estado",
                                            e.target.value
                                        )
                                    }
                                    placeholder="SP"
                                    maxLength={2}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                            <div>
                                <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Latitude *
                                </Label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={formData.endereco.latitude}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endereco.latitude",
                                            e.target.value
                                        )
                                    }
                                    placeholder="-23.5505"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Longitude *
                                </Label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={formData.endereco.longitude}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "endereco.longitude",
                                            e.target.value
                                        )
                                    }
                                    placeholder="-46.6333"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 text-sm text-blue-600">
                                <p>
                                    💡 As coordenadas são obrigatórias para que
                                    o imóvel apareça no mapa. Preencha o CEP
                                    para busca automática ou use o botão "Buscar
                                    Coordenadas".
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">
                            Características
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <Label>Preço (R$) *</Label>
                                <Input
                                    type="number"
                                    value={formData.preco}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "preco",
                                            e.target.value
                                        )
                                    }
                                    placeholder="250000"
                                    required
                                />
                            </div>
                            <div>
                                <Label>Área (m²)</Label>
                                <Input
                                    type="number"
                                    value={formData.area}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "area",
                                            e.target.value
                                        )
                                    }
                                    placeholder="120"
                                />
                            </div>
                            <div>
                                <Label>Quartos</Label>
                                <Input
                                    type="number"
                                    value={formData.quartos}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "quartos",
                                            e.target.value
                                        )
                                    }
                                    placeholder="3"
                                />
                            </div>
                            <div>
                                <Label>Banheiros</Label>
                                <Input
                                    type="number"
                                    value={formData.banheiros}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "banheiros",
                                            e.target.value
                                        )
                                    }
                                    placeholder="2"
                                />
                            </div>
                            <div>
                                <Label>Vagas</Label>
                                <Input
                                    type="number"
                                    value={formData.vagas}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "vagas",
                                            e.target.value
                                        )
                                    }
                                    placeholder="1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Fotos</Label>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                {isUploading
                                    ? "Selecionando..."
                                    : "Adicionar Fotos"}
                            </Button>
                            <p className="text-sm text-gray-500 mt-2">
                                Formatos aceitos: JPG, PNG, WEBP
                            </p>
                        </div>
                        {formData.fotos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {formData.fotos.map((foto, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={foto.dados}
                                            alt={foto.nomeArquivo}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar Imóvel"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
