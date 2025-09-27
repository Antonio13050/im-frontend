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
import { Calendar, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import ClienteActions from "./ClienteActions";
import { formatTelefone } from "@/lib/formatters";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ClientesTable({
    paginatedClientes,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    onEdit,
    onDelete,
    canEdit,
    clientImoveisMap,
    isLoading,
    sortField,
    sortOrder,
    handleSort,
}) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="animate-pulse space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-12 bg-gray-200"></TableHead>
                                <TableHead className="h-12 bg-gray-200"></TableHead>
                                <TableHead className="h-12 bg-gray-200"></TableHead>
                                <TableHead className="h-12 bg-gray-200"></TableHead>
                                <TableHead className="h-12 bg-gray-200"></TableHead>
                                <TableHead className="h-12 bg-gray-200"></TableHead>
                                <TableHead className="h-12 bg-gray-200"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="h-12 bg-gray-200"></TableCell>
                                        <TableCell className="h-12 bg-gray-200"></TableCell>
                                        <TableCell className="h-12 bg-gray-200"></TableCell>
                                        <TableCell className="h-12 bg-gray-200"></TableCell>
                                        <TableCell className="h-12 bg-gray-200"></TableCell>
                                        <TableCell className="h-12 bg-gray-200"></TableCell>
                                        <TableCell className="h-12 bg-gray-200"></TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="p-0 m-0">
                            <Button
                                variant="ghost"
                                className="flex items-center p-0 m-0 text-left w-full justify-start"
                                onClick={() => handleSort("nome")}
                            >
                                Nome
                                <ArrowUpDown
                                    className={`h-4 w-4 ${
                                        sortField === "nome"
                                            ? "text-blue-500"
                                            : "text-gray-500"
                                    }`}
                                />
                            </Button>
                        </TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Interesses</TableHead>
                        <TableHead className="p-0 m-0">
                            <Button
                                variant="ghost"
                                className="flex items-center p-0 m-0 text-left w-full justify-start"
                                onClick={() => handleSort("imoveis")}
                            >
                                Imóveis Vinculados
                                <ArrowUpDown
                                    className={`h-4 w-4 ${
                                        sortField === "imoveis"
                                            ? "text-blue-500"
                                            : "text-gray-500"
                                    }`}
                                />
                            </Button>
                        </TableHead>
                        <TableHead className="p-0 m-0">
                            <Button
                                variant="ghost"
                                className="flex items-center p-0 m-0 text-left w-full justify-start"
                                onClick={() => handleSort("createdDate")}
                            >
                                Data de Cadastro
                                <ArrowUpDown
                                    className={`h-4 w-4 ${
                                        sortField === "createdDate"
                                            ? "text-blue-500"
                                            : "text-gray-500"
                                    }`}
                                />
                            </Button>
                        </TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedClientes.length > 0 ? (
                        paginatedClientes.map((cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell className="font-medium pl-3">
                                    {cliente.nome}
                                </TableCell>
                                <TableCell>
                                    {cliente.email || "Não cadastrado"}
                                </TableCell>
                                <TableCell>
                                    {cliente.telefone
                                        ? formatTelefone(cliente.telefone)
                                        : "Não cadastrado"}
                                </TableCell>
                                <TableCell>
                                    {cliente.interesses ? (
                                        <div className="flex flex-wrap gap-1">
                                            {cliente.interesses.tiposImovel?.map(
                                                (tipo, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {tipo}
                                                    </Badge>
                                                )
                                            )}
                                            {cliente.interesses.finalidade && (
                                                <Badge
                                                    className={
                                                        cliente.interesses
                                                            .finalidade ===
                                                        "venda"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-blue-100 text-blue-800"
                                                    }
                                                >
                                                    {cliente.interesses
                                                        .finalidade === "venda"
                                                        ? "Compra"
                                                        : "Aluguel"}
                                                </Badge>
                                            )}
                                        </div>
                                    ) : (
                                        "N/A"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {clientImoveisMap[cliente.id]?.length >
                                    0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {clientImoveisMap[cliente.id].map(
                                                (imovel) => (
                                                    <Link
                                                        key={imovel.id}
                                                        to={`/imovel-detalhes/${imovel.id}`}
                                                    >
                                                        <Badge
                                                            variant="secondary"
                                                            className="hover:bg-gray-300"
                                                        >
                                                            {imovel.titulo}
                                                        </Badge>
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="pl-2">
                                            Nenhum imóvel
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="pl-3">
                                    {format(
                                        new Date(cliente.createdDate),
                                        "dd/MM/yyyy 'às' HH:mm",
                                        { locale: ptBR }
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ClienteActions
                                        canEdit={canEdit(cliente)}
                                        onEdit={() => onEdit(cliente)}
                                        onDelete={() => onDelete(cliente.id)}
                                        cliente={cliente}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                className="text-center text-gray-500"
                            >
                                Nenhum cliente encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {pagination.totalItems > 0 && (
                <div className="flex justify-between items-center p-4 border-t">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Mostrando {paginatedClientes.length} de{" "}
                            {pagination.totalItems} clientes
                        </span>
                        <Select
                            value={pagination.pageSize.toString()}
                            onValueChange={(value) =>
                                handlePageSizeChange(Number(value))
                            }
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-600">
                            por página
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={pagination.currentPage === 0}
                            onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                            }
                        >
                            Anterior
                        </Button>
                        <span className="text-sm text-gray-600">
                            Página {pagination.currentPage + 1} de{" "}
                            {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={
                                pagination.currentPage >=
                                pagination.totalPages - 1
                            }
                            onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                            }
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
