import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Home, DollarSign, MapPin } from "lucide-react";

export default function PreferencesSection({
    formData,
    onInputChange,
    isLocatario,
}) {
    const [newBairro, setNewBairro] = useState("");

    const tiposImovel = [
        { value: "casa", label: "Casa" },
        { value: "apartamento", label: "Apartamento" },
        { value: "terreno", label: "Terreno" },
        { value: "comercial", label: "Comercial" },
        { value: "galpao", label: "Galpão" },
        { value: "chacara", label: "Chácara" },
        { value: "kitnet", label: "Kitnet/Studio" },
        { value: "cobertura", label: "Cobertura" },
        { value: "loft", label: "Loft" },
    ];

    const handleTipoImovelChange = (tipo, checked) => {
        const interesses = formData.interesses || {};
        const tiposAtuais = interesses.tiposImovel || [];
        onInputChange(
            "interesses.tiposImovel",
            checked
                ? [...tiposAtuais, tipo]
                : tiposAtuais.filter((t) => t !== tipo)
        );
    };

    const addBairro = () => {
        const trimmed = newBairro.trim();
        const interesses = formData.interesses || {};
        const bairrosAtuais = interesses.bairrosInteresse || [];
        if (trimmed && !bairrosAtuais.includes(trimmed)) {
            onInputChange("interesses.bairrosInteresse", [
                ...bairrosAtuais,
                trimmed,
            ]);
            setNewBairro("");
        }
    };

    const removeBairro = (index) => {
        const interesses = formData.interesses || {};
        const bairrosAtuais = interesses.bairrosInteresse || [];
        onInputChange(
            "interesses.bairrosInteresse",
            bairrosAtuais.filter((_, i) => i !== index)
        );
    };

    const interesses = formData.interesses || {};

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-pink-600" />
                <Label className="text-lg font-semibold">Preferências e Interesses</Label>
            </div>

            {/* Finalidade */}
            {!isLocatario && (
                <div className="border-b pb-6">
                    <Label className="text-sm font-medium">Finalidade</Label>
                    <Select
                        value={interesses.finalidade || "venda"}
                        onValueChange={(value) =>
                            onInputChange("interesses.finalidade", value)
                        }
                    >
                        <SelectTrigger className="mt-2">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="venda">Compra</SelectItem>
                            <SelectItem value="aluguel">Aluguel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Tipos de Imóvel */}
            <div className="border-b pb-6">
                <Label className="text-sm font-medium mb-4 block">
                    Tipos de Imóvel de Interesse
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tiposImovel.map((tipo) => (
                        <div
                            key={tipo.value}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={tipo.value}
                                checked={(interesses.tiposImovel || []).includes(
                                    tipo.value
                                )}
                                onCheckedChange={(checked) =>
                                    handleTipoImovelChange(tipo.value, checked)
                                }
                            />
                            <Label htmlFor={tipo.value} className="text-sm cursor-pointer">
                                {tipo.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Faixa de Preço */}
            <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <Label className="text-sm font-medium">Faixa de Preço (R$)</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-sm font-medium">Valor Mínimo</Label>
                        <Input
                            type="number"
                            value={interesses.faixaPrecoMin || ""}
                            onChange={(e) =>
                                onInputChange(
                                    "interesses.faixaPrecoMin",
                                    e.target.value
                                )
                            }
                            placeholder="100000"
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Valor Máximo</Label>
                        <Input
                            type="number"
                            value={interesses.faixaPrecoMax || ""}
                            onChange={(e) =>
                                onInputChange(
                                    "interesses.faixaPrecoMax",
                                    e.target.value
                                )
                            }
                            placeholder="500000"
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            {/* Características Desejadas */}
            <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Home className="w-4 h-4 text-blue-600" />
                    <Label className="text-sm font-medium">Características Desejadas</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label className="text-sm font-medium">Quartos (mínimo)</Label>
                        <Input
                            type="number"
                            min="0"
                            value={interesses.quartos || ""}
                            onChange={(e) =>
                                onInputChange("interesses.quartos", e.target.value)
                            }
                            placeholder="Ex: 2"
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Banheiros (mínimo)</Label>
                        <Input
                            type="number"
                            min="0"
                            value={interesses.banheiros || ""}
                            onChange={(e) =>
                                onInputChange("interesses.banheiros", e.target.value)
                            }
                            placeholder="Ex: 2"
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Vagas (mínimo)</Label>
                        <Input
                            type="number"
                            min="0"
                            value={interesses.vagas || ""}
                            onChange={(e) =>
                                onInputChange("interesses.vagas", e.target.value)
                            }
                            placeholder="Ex: 1"
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            {/* Bairros de Interesse */}
            <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <Label className="text-sm font-medium">Bairros de Interesse</Label>
                </div>
                <div className="flex gap-3 mb-3">
                    <Input
                        value={newBairro}
                        onChange={(e) => setNewBairro(e.target.value)}
                        placeholder="Digite um bairro"
                        onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addBairro())
                        }
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        onClick={addBairro}
                        variant="outline"
                        className="px-4 py-2"
                    >
                        Adicionar
                    </Button>
                </div>
                {(interesses.bairrosInteresse || []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {interesses.bairrosInteresse.map((bairro, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md text-sm flex items-center gap-2"
                            >
                                {bairro}
                                <button
                                    type="button"
                                    onClick={() => removeBairro(index)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Observações sobre Preferências */}
            <div>
                <Label className="text-sm font-medium mb-2 block">
                    Observações sobre Preferências
                </Label>
                <Textarea
                    value={interesses.observacoesPreferencias || ""}
                    onChange={(e) =>
                        onInputChange("interesses.observacoesPreferencias", e.target.value)
                    }
                    placeholder="Informações adicionais sobre as preferências do cliente..."
                    rows={4}
                />
            </div>
        </div>
    );
}
