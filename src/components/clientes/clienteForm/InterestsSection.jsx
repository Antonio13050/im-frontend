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

export default function InterestsSection({ formData, onInputChange }) {
    const [newBairro, setNewBairro] = useState("");

    const tiposImovel = [
        { value: "casa", label: "Casa" },
        { value: "apartamento", label: "Apartamento" },
        { value: "terreno", label: "Terreno" },
        { value: "comercial", label: "Comercial" },
        { value: "galpao", label: "Galpão" },
        { value: "chacara", label: "Chácara" },
    ];

    const handleTipoImovelChange = (tipo, checked) => {
        onInputChange(
            "interesses.tiposImovel",
            checked
                ? [...formData.interesses.tiposImovel, tipo]
                : formData.interesses.tiposImovel.filter((t) => t !== tipo)
        );
    };

    const addBairro = () => {
        const trimmed = newBairro.trim();
        if (
            trimmed &&
            !formData.interesses.bairrosInteresse.includes(trimmed)
        ) {
            onInputChange("interesses.bairrosInteresse", [
                ...formData.interesses.bairrosInteresse,
                trimmed,
            ]);
            setNewBairro("");
        }
    };

    const removeBairro = (index) => {
        onInputChange(
            "interesses.bairrosInteresse",
            formData.interesses.bairrosInteresse.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="space-y-6">
            <Label className="text-xl font-bold">Interesses</Label>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Finalidade</Label>
                <Select
                    value={formData.interesses.finalidade}
                    onValueChange={(value) =>
                        onInputChange("interesses.finalidade", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="venda">Compra</SelectItem>
                        <SelectItem value="aluguel">Aluguel</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">Tipos de Imóvel</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tiposImovel.map((tipo) => (
                        <div
                            key={tipo.value}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={tipo.value}
                                checked={formData.interesses.tiposImovel.includes(
                                    tipo.value
                                )}
                                onCheckedChange={(checked) =>
                                    handleTipoImovelChange(tipo.value, checked)
                                }
                            />
                            <Label htmlFor={tipo.value} className="text-sm">
                                {tipo.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">
                    Faixa de Preço (R$)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className="text-sm font-medium">Mínimo</Label>
                        <Input
                            type="number"
                            value={formData.interesses.faixaPrecoMin}
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
                        <Label className="text-sm font-medium">Máximo</Label>
                        <Input
                            type="number"
                            value={formData.interesses.faixaPrecoMax}
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

            <div className="space-y-2">
                <Label className="text-sm font-medium">
                    Bairros de Interesse
                </Label>
                <div className="flex gap-3 mb-3">
                    <Input
                        value={newBairro}
                        onChange={(e) => setNewBairro(e.target.value)}
                        placeholder="Digite um bairro"
                        onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addBairro())
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
                {formData.interesses.bairrosInteresse.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.interesses.bairrosInteresse.map(
                            (bairro, index) => (
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
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
