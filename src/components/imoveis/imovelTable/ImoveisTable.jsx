import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function ImoveisTable({
    imoveis,
    clientesMap,
    corretoresMap,
    onEdit,
    onDelete,
    canEdit,
}) {
    if (!imoveis || imoveis.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
                Nenhum imóvel encontrado.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Corretor</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="pl-4">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {imoveis.map((imovel) => (
                        <TableRow key={imovel.id}>
                            <TableCell className="font-medium">
                                <Link
                                    to={`/imovel-detalhes/${imovel.id}`}
                                    className="hover:underline text-blue-600"
                                >
                                    {imovel.titulo}
                                </Link>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1 text-gray-700">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>
                                        {imovel.endereco?.bairro},{" "}
                                        {imovel.endereco?.cidade}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <span className="font-semibold text-blue-700">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(imovel.preco)}
                                </span>
                            </TableCell>

                            <TableCell>
                                {corretoresMap.get(imovel.corretorId) || "—"}
                            </TableCell>

                            <TableCell>
                                {clientesMap.get(imovel.clienteId) || "—"}
                            </TableCell>

                            <TableCell>
                                <Badge
                                    className={
                                        imovel.status === "vendido"
                                            ? "bg-green-100 text-green-700"
                                            : imovel.status === "alugado"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-700"
                                    }
                                >
                                    {imovel.status || "Indefinido"}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-1 text-gray-700">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    {format(
                                        new Date(imovel.createdDate),
                                        "dd/MM/yyyy",
                                        { locale: ptBR }
                                    )}
                                </div>
                            </TableCell>

                            <TableCell className="text-right">
                                {canEdit(imovel) && (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(imovel.id)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                to={`/imovel-detalhes/${imovel.id}`}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(imovel.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
