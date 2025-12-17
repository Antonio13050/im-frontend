import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Loader2 } from "lucide-react";
import { getCoordinates } from "@/services/GeocodeService";
import { toast } from "sonner";

export default function AddressSection({
    formData,
    onInputChange,
    isGeocoding,
    setIsGeocoding,
    isBuscandoCep,
    setIsBuscandoCep,
    errors,
}) {
    const formatCep = (value) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 5) return cleaned;
        return cleaned.replace(/(\d{5})(\d{0,3})/, "$1-$2");
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
                onInputChange(
                    "endereco.rua",
                    data.logradouro || formData.endereco.rua
                );
                onInputChange(
                    "endereco.bairro",
                    data.bairro || formData.endereco.bairro
                );
                onInputChange(
                    "endereco.cidade",
                    data.localidade || formData.endereco.cidade
                );
                onInputChange(
                    "endereco.estado",
                    data.uf || formData.endereco.estado
                );
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
        setIsBuscandoCep(false);
    };

    const handleCepChange = (e) => {
        const formatted = formatCep(e.target.value);
        onInputChange("endereco.cep", formatted);
        const cleanCep = formatted.replace(/\D/g, "");
        if (/^\d{8}$/.test(cleanCep)) {
            buscarEnderecoPorCep(cleanCep);
        }
    };

    const buscarCoordenadas = async () => {
        const { rua, numero, bairro, cidade, estado } = formData.endereco;
        const enderecoCompleto = `${rua}${numero ? ", " + numero : ""}${bairro ? ", " + bairro : ""
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
                onInputChange("endereco.latitude", data.latitude);
                onInputChange("endereco.longitude", data.longitude);
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
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Endereço *</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={buscarCoordenadas}
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
                        />
                        {isBuscandoCep && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            </div>
                        )}
                    </div>
                    {errors?.["endereco.cep"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.cep"]}
                        </p>
                    )}
                    <p className="text-xs text-blue-600 mt-1">
                        💡 Preencha o CEP para busca automática do endereço
                    </p>
                </div>

                <div className="md:col-span-2">
                    <Label>Rua *</Label>
                    <Input
                        value={formData.endereco.rua}
                        onChange={(e) =>
                            onInputChange("endereco.rua", e.target.value)
                        }
                        placeholder="Nome da rua"
                    />
                    {errors?.["endereco.rua"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.rua"]}
                        </p>
                    )}
                </div>

                <div>
                    <Label>Número *</Label>
                    <Input
                        value={formData.endereco.numero}
                        onChange={(e) =>
                            onInputChange("endereco.numero", e.target.value)
                        }
                        placeholder="123"
                    />
                    {errors?.["endereco.numero"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.numero"]}
                        </p>
                    )}
                </div>
                <div>
                    <Label>Bairro *</Label>
                    <Input
                        value={formData.endereco.bairro}
                        onChange={(e) =>
                            onInputChange("endereco.bairro", e.target.value)
                        }
                        placeholder="Nome do bairro"
                    />
                    {errors?.["endereco.bairro"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.bairro"]}
                        </p>
                    )}
                </div>
                <div>
                    <Label>Cidade *</Label>
                    <Input
                        value={formData.endereco.cidade}
                        onChange={(e) =>
                            onInputChange("endereco.cidade", e.target.value)
                        }
                        placeholder="Nome da cidade"
                    />
                    {errors?.["endereco.cidade"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.cidade"]}
                        </p>
                    )}
                </div>
                <div>
                    <Label>Estado *</Label>
                    <Input
                        value={formData.endereco.estado}
                        onChange={(e) =>
                            onInputChange("endereco.estado", e.target.value)
                        }
                        placeholder="SP"
                        maxLength={2}
                    />
                    {errors?.["endereco.estado"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.estado"]}
                        </p>
                    )}
                </div>
            </div>

            {/* Complemento e Andar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Complemento</Label>
                    <Input
                        value={formData.endereco.complemento || ""}
                        onChange={(e) =>
                            onInputChange("endereco.complemento", e.target.value)
                        }
                        placeholder="Apartamento, Bloco, Sala..."
                    />
                </div>
                <div>
                    <Label>Andar</Label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.endereco.andar || ""}
                        onChange={(e) =>
                            onInputChange("endereco.andar", e.target.value)
                        }
                        placeholder="Ex: 5"
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
                            onInputChange("endereco.latitude", e.target.value)
                        }
                        placeholder="-23.5505"
                    />
                    {errors?.["endereco.latitude"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.latitude"]}
                        </p>
                    )}
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
                            onInputChange("endereco.longitude", e.target.value)
                        }
                        placeholder="-46.6333"
                    />
                    {errors?.["endereco.longitude"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["endereco.longitude"]}
                        </p>
                    )}
                </div>
                <div className="md:col-span-2 text-sm text-blue-600">
                    <p>
                        💡 As coordenadas são obrigatórias para que o imóvel
                        apareça no mapa. Preencha o CEP para busca automática ou
                        use o botão "Buscar Coordenadas".
                    </p>
                </div>
            </div>
        </div>
    );
}
