import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Edit } from "lucide-react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VisitTable({
    visits,
    onEdit,
    onStatusUpdate,
    getStatusColor,
    users,
    currentUser,
}) {
    console.log("VisitTable render - visits:", visits);
    const [usersMap, setUsersMap] = useState(new Map());
    const getStatusLabel = (status) => {
        const labels = {
            agendada: "Agendada",
            confirmada: "Confirmada",
            realizada: "Realizada",
            cancelada: "Cancelada",
            reagendada: "Reagendada",
        };
        return labels[status] || status;
    };

    useEffect(() => {
        const map = new Map(users.map((u) => [u.userId, u.nome]));
        if (currentUser) {
            map.set(Number(currentUser.sub), currentUser.nome);
        }
        setUsersMap(map);
    }, [users, currentUser]);

    const getRealtorName = (realtorId) => {
        return usersMap.get(Number(realtorId)) || "Corretor não encontrado";
    };

    if (visits.length === 0) {
        return (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                <div className="w-16 h-16 text-gray-300 mx-auto mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma visita encontrada
                </h3>
                <p className="text-gray-600">
                    Ajuste os filtros ou agende uma nova visita.
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
                                Data e Hora
                            </TableHead>
                            <TableHead className="font-semibold">
                                Status
                            </TableHead>
                            <TableHead className="font-semibold">
                                Corretor
                            </TableHead>
                            <TableHead className="font-semibold text-center">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visits.map((visit) => (
                            <TableRow
                                key={visit.id}
                                className="hover:bg-gray-50"
                            >
                                <TableCell>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {visit.property.titulo}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {`${visit.property.endereco.rua}, ${visit.property.endereco.numero} - ${visit.property.endereco.bairro}`}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {visit.client.nome}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Phone className="w-3 h-3" />
                                            <span>{visit.client.telefone}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p>
                                            {format(
                                                parse(
                                                    visit.scheduledDate,
                                                    "yyyy-MM-dd",
                                                    new Date()
                                                ),
                                                "dd/MM/yyyy",
                                                { locale: ptBR }
                                            )}
                                        </p>
                                        <p className="text-gray-600">
                                            {visit.scheduledTime}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={getStatusColor(visit.status)}
                                    >
                                        {getStatusLabel(visit.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm font-medium text-gray-700">
                                        {getRealtorName(visit.corretorId)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(visit)}
                                            className="text-gray-600 hover:text-gray-700"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Mudar Status
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onStatusUpdate(
                                                            visit.id,
                                                            "agendada"
                                                        )
                                                    }
                                                >
                                                    Agendada
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onStatusUpdate(
                                                            visit.id,
                                                            "confirmada"
                                                        )
                                                    }
                                                >
                                                    Confirmada
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onStatusUpdate(
                                                            visit.id,
                                                            "realizada"
                                                        )
                                                    }
                                                >
                                                    Realizada
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onStatusUpdate(
                                                            visit.id,
                                                            "cancelada"
                                                        )
                                                    }
                                                >
                                                    Cancelada
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onStatusUpdate(
                                                            visit.id,
                                                            "reagendada"
                                                        )
                                                    }
                                                >
                                                    Reagendada
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
