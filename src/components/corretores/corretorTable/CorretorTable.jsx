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
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePerfilConfig } from "@/hooks/usePerfilConfig";
import { formatTelefone } from "@/lib/formatters";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CorretorActions from "./CorretorActions";

export default function CorretorTable({
    paginatedCorretores,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    onEdit,
    onToggleStatus,
    isLoading,
    sortField,
    sortOrder,
    handleSort,
}) {
    const perfilConfigs = {
        ADMIN: usePerfilConfig("ADMIN"),
        GERENTE: usePerfilConfig("GERENTE"),
        CORRETOR: usePerfilConfig("CORRETOR"),
    };
    const canEdit = (corretor) =>
        corretor.userId === corretor.userId ||
        corretor.perfil === "ADMIN" ||
        corretor.perfil === "GERENTE";
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="animate-pulse space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Array(8)
                                    .fill()
                                    .map((_, index) => (
                                        <TableHead
                                            key={index}
                                            className="h-12 bg-gray-200"
                                        ></TableHead>
                                    ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(5)
                                .fill()
                                .map((_, i) => (
                                    <TableRow key={i}>
                                        {Array(8)
                                            .fill()
                                            .map((_, j) => (
                                                <TableCell
                                                    key={j}
                                                    className="h-12 bg-gray-200"
                                                ></TableCell>
                                            ))}
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
                        <TableHead>CRECI</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Status</TableHead>
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
                        <TableHead>Editar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedCorretores.length > 0 ? (
                        paginatedCorretores.map((corretor) => {
                            const perfil =
                                corretor.roles?.[0]?.nome || "CORRETOR";
                            const { color, label } = perfilConfigs[perfil] || {
                                color: "bg-gray-100 text-gray-800",
                                label: perfil || "Desconhecido",
                            };
                            return (
                                <TableRow key={corretor.userId}>
                                    <TableCell className="font-medium pl-3">
                                        {corretor.nome || corretor.email}
                                    </TableCell>
                                    <TableCell>
                                        {corretor.email || "Não cadastrado"}
                                    </TableCell>
                                    <TableCell>
                                        {corretor.telefone
                                            ? formatTelefone(corretor.telefone)
                                            : "Não cadastrado"}
                                    </TableCell>
                                    <TableCell>
                                        {corretor.creci || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={color}>{label}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                corretor.ativo
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                corretor.ativo
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {corretor.ativo
                                                ? "Ativo"
                                                : "Inativo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {/* {format(
                                            new Date(corretor.createdDate),
                                            "dd/MM/yyyy 'às' HH:mm",
                                            { locale: ptBR }
                                        )} */}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <CorretorActions
                                            canEdit={canEdit(corretor)}
                                            onEdit={onEdit}
                                            onToggleStatus={onToggleStatus}
                                            corretor={corretor}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-center text-gray-500"
                            >
                                Nenhum corretor encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {pagination.totalItems > 0 && (
                <div className="flex justify-between items-center p-4 border-t">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Mostrando {paginatedCorretores.length} de{" "}
                            {pagination.totalItems} corretores
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
