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
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Interesses</Label>

            <div>
                <Label>Finalidade</Label>
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

            <div>
                <Label>Tipos de Imóvel</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Preço Mínimo (R$)</Label>
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
                    />
                </div>
                <div>
                    <Label>Preço Máximo (R$)</Label>
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
                    />
                </div>
            </div>

            <div>
                <Label>Bairros de Interesse</Label>
                <div className="flex gap-2 mb-2">
                    <Input
                        value={newBairro}
                        onChange={(e) => setNewBairro(e.target.value)}
                        placeholder="Digite um bairro"
                        onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addBairro())
                        }
                    />
                    <Button type="button" onClick={addBairro} variant="outline">
                        Adicionar
                    </Button>
                </div>
                {formData.interesses.bairrosInteresse.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.interesses.bairrosInteresse.map(
                            (bairro, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                                >
                                    {bairro}
                                    <button
                                        type="button"
                                        onClick={() => removeBairro(index)}
                                        className="ml-1 hover:text-blue-900"
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
