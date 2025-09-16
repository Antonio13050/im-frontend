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

export default function ImovelFilters({ filters, onFiltersChange }) {
    const handleFilterChange = (key, value) => {
        onFiltersChange((prev) => ({
            ...prev,
            [key]: value,
        }));
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
                    placeholder="R$ 0"
                    value={filters.precoMin}
                    onChange={(e) =>
                        handleFilterChange("precoMin", e.target.value)
                    }
                />
            </div>

            <div>
                <Label className="text-sm font-medium text-gray-700">
                    Preço Máximo
                </Label>
                <Input
                    type="number"
                    placeholder="R$ 999.999"
                    value={filters.precoMax}
                    onChange={(e) =>
                        handleFilterChange("precoMax", e.target.value)
                    }
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
