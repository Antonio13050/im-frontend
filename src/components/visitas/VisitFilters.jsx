import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function VisitFilters({ filters, onFilterChange }) {
    const handleChange = (field, value) => {
        onFilterChange((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label>Status da Visita</Label>
                <Select
                    value={filters.status}
                    onValueChange={(value) => handleChange("status", value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Todas as visitas</SelectItem>
                        <SelectItem value="agendada">Agendadas</SelectItem>
                        <SelectItem value="confirmada">Confirmadas</SelectItem>
                        <SelectItem value="realizada">Realizadas</SelectItem>
                        <SelectItem value="cancelada">Canceladas</SelectItem>
                        <SelectItem value="reagendada">Reagendadas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Período</Label>
                <Select
                    value={filters.period}
                    onValueChange={(value) => handleChange("period", value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Todas as datas</SelectItem>
                        <SelectItem value="hoje">Hoje</SelectItem>
                        <SelectItem value="amanha">Amanhã</SelectItem>
                        <SelectItem value="esta_semana">Esta semana</SelectItem>
                        <SelectItem value="proximo_mes">Próximo mês</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
