import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Edit, DollarSign, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ProcessTable({
    processos,
    onEdit,
    onViewDetails,
    getStatusColor,
}) {
    const getStatusLabel = (status) => {
        const labels = {
            interesse_manifestado: "Interesse Manifestado",
            proposta_enviada: "Proposta Enviada",
            negociacao: "Negociação",
            proposta_aceita: "Proposta Aceita",
            documentacao_pendente: "Documentação Pendente",
            analise_credito: "Análise de Crédito",
            aprovacao_financeira: "Aprovação Financeira",
            contrato_assinado: "Contrato Assinado",
            vistoria_agendada: "Vistoria Agendada",
            vistoria_realizada: "Vistoria Realizada",
            entrega_chaves: "Entrega das Chaves",
            processo_concluido: "Processo Concluído",
            cancelado: "Cancelado",
        };
        return labels[status] || status;
    };

    const getFinancingTypeLabel = (type) => {
        const labels = {
            vista: "À Vista",
            financiamento: "Financiamento",
            consorcio: "Consórcio",
        };
        return labels[type] || type;
    };

    if (processos.length === 0) {
        return (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                <div className="w-16 h-16 text-gray-300 mx-auto mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum processo encontrado
                </h3>
                <p className="text-gray-600">
                    Ajuste os filtros ou crie um novo processo.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <Table>
                    <TableHeader className="bg-gray-50 sticky top-0 z-10">
                        <TableRow>
                            <TableHead className="font-semibold">
                                Imóvel
                            </TableHead>
                            <TableHead className="font-semibold">
                                Cliente
                            </TableHead>
                            <TableHead className="font-semibold">
                                Status
                            </TableHead>
                            <TableHead className="font-semibold">
                                Valor Proposto
                            </TableHead>
                            <TableHead className="font-semibold">
                                Financiamento
                            </TableHead>
                            <TableHead className="font-semibold">
                                Criado em
                            </TableHead>
                            <TableHead className="font-semibold text-center">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processos.map((processo) => (
                            <TableRow
                                key={processo.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => onViewDetails(processo)}
                            >
                                <TableCell className="font-medium">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {processo.imovel.titulo}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {"processo.imovel.address"}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {processo.cliente.nome}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Phone className="w-3 h-3" />
                                            <span>
                                                {processo.cliente.telefone}
                                            </span>
                                        </div>
                                        {processo.cliente.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Mail className="w-3 h-3" />
                                                <span>
                                                    {processo.cliente.email}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={getStatusColor(
                                            processo.status
                                        )}
                                    >
                                        {getStatusLabel(processo.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {processo.valorProposto ? (
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">
                                                R${" "}
                                                {processo.valorProposto.toLocaleString(
                                                    "pt-BR",
                                                    { minimumFractionDigits: 2 }
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">
                                        {getFinancingTypeLabel(
                                            processo.tipoFinanciamento
                                        )}
                                    </span>
                                    {processo.nomeBanco && (
                                        <p className="text-xs text-gray-500">
                                            {processo.nomeBanco}
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {format(
                                        new Date(processo.createdDate),
                                        "dd/MM/yyyy",
                                        { locale: ptBR }
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewDetails(processo);
                                            }}
                                            className="text-blue-600 hover:text-blue-700"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(processo);
                                            }}
                                            className="text-gray-600 hover:text-gray-700"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
