import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ProcessFilters({ filters, onFilterChange }) {
    const handleChange = (field, value) => {
        onFilterChange((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label>Status do Processo</Label>
                <Select
                    value={filters.status}
                    onValueChange={(value) => handleChange("status", value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos os status</SelectItem>
                        <SelectItem value="interesse_manifestado">
                            Interesse Manifestado
                        </SelectItem>
                        <SelectItem value="proposta_enviada">
                            Proposta Enviada
                        </SelectItem>
                        <SelectItem value="negociacao">Negociação</SelectItem>
                        <SelectItem value="proposta_aceita">
                            Proposta Aceita
                        </SelectItem>
                        <SelectItem value="documentacao_pendente">
                            Documentação Pendente
                        </SelectItem>
                        <SelectItem value="analise_credito">
                            Análise de Crédito
                        </SelectItem>
                        <SelectItem value="aprovacao_financeira">
                            Aprovação Financeira
                        </SelectItem>
                        <SelectItem value="contrato_assinado">
                            Contrato Assinado
                        </SelectItem>
                        <SelectItem value="vistoria_agendada">
                            Vistoria Agendada
                        </SelectItem>
                        <SelectItem value="vistoria_realizada">
                            Vistoria Realizada
                        </SelectItem>
                        <SelectItem value="entrega_chaves">
                            Entrega das Chaves
                        </SelectItem>
                        <SelectItem value="processo_concluido">
                            Processo Concluído
                        </SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Período de Criação</Label>
                <Select
                    value={filters.period}
                    onValueChange={(value) => handleChange("period", value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos os períodos</SelectItem>
                        <SelectItem value="ultimos_7_dias">
                            Últimos 7 dias
                        </SelectItem>
                        <SelectItem value="ultimo_mes">Último mês</SelectItem>
                        <SelectItem value="ultimos_3_meses">
                            Últimos 3 meses
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
