import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ImovelFilters({ filters, onFiltersChange }) {
    const handleFilterChange = (key, value) => {
        // Atualiza o filtro específico diretamente
        // Validações de preço são feitas nos próprios inputs via onBlur
        onFiltersChange({ [key]: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Status
                </Label>
                <Select
                    value={filters.status}
                    onValueChange={(value) =>
                        handleFilterChange("status", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                        <SelectItem value="alugado">Alugado</SelectItem>
                        <SelectItem value="reservado">Reservado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Tipo
                </Label>
                <Select
                    value={filters.tipo}
                    onValueChange={(value) => handleFilterChange("tipo", value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="galpao">Galpão</SelectItem>
                        <SelectItem value="chacara">Chácara</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Preço Mínimo
                </Label>
                <Input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="R$ 0"
                    value={filters.precoMin}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Permite digitação livre, validação apenas ao perder foco
                        onFiltersChange({ precoMin: value });
                    }}
                    onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== "") {
                            const numValue = parseFloat(value);
                            if (isNaN(numValue) || numValue < 0) {
                                toast.error("Preço deve ser um número positivo");
                                onFiltersChange({ precoMin: "" });
                            } else if (
                                filters.precoMax &&
                                numValue > parseFloat(filters.precoMax)
                            ) {
                                toast.error(
                                    "Preço mínimo não pode ser maior que o máximo"
                                );
                            }
                        }
                    }}
                />
            </div>

            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Preço Máximo
                </Label>
                <Input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="R$ 999.999"
                    value={filters.precoMax}
                    onChange={(e) => {
                        const value = e.target.value;
                        // Permite digitação livre, validação apenas ao perder foco
                        onFiltersChange({ precoMax: value });
                    }}
                    onBlur={(e) => {
                        const value = e.target.value;
                        if (value !== "") {
                            const numValue = parseFloat(value);
                            if (isNaN(numValue) || numValue < 0) {
                                toast.error("Preço deve ser um número positivo");
                                onFiltersChange({ precoMax: "" });
                            } else if (
                                filters.precoMin &&
                                numValue < parseFloat(filters.precoMin)
                            ) {
                                toast.error(
                                    "Preço máximo deve ser maior que o mínimo"
                                );
                            }
                        }
                    }}
                />
            </div>

            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Bairro
                </Label>
                <Input
                    placeholder="Digite o bairro"
                    value={filters.bairro}
                    onChange={(e) =>
                        handleFilterChange("bairro", e.target.value)
                    }
                />
            </div>
        </div>
    );
}
