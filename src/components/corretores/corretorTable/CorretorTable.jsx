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
import CorretorActions from "./CorretorActions";

export default function CorretorTable({
    paginatedCorretores,
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
        </div>
    );
}
