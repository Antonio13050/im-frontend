import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import ClienteActions from "../clienteCard/ClienteActions";
import { formatTelefone } from "@/lib/formatters";

export default function ClientesTable({
    filteredClientes,
    onEdit,
    onDelete,
    canEdit,
    clientImoveisMap,
}) {
    if (filteredClientes.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum cliente encontrado
                </h3>
                <p className="text-gray-500">
                    Tente ajustar a busca ou adicione um novo cliente
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Interesses</TableHead>
                        <TableHead>Imóveis Vinculados</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredClientes.map((cliente) => {
                        const faixaPreco = cliente.interesses
                            ? cliente.interesses.faixaPrecoMin &&
                              cliente.interesses.faixaPrecoMax
                                ? `${new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                  }).format(
                                      cliente.interesses.faixaPrecoMin
                                  )} - ${new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                  }).format(cliente.interesses.faixaPrecoMax)}`
                                : cliente.interesses.faixaPrecoMin
                                ? `A partir de ${new Intl.NumberFormat(
                                      "pt-BR",
                                      { style: "currency", currency: "BRL" }
                                  ).format(cliente.interesses.faixaPrecoMin)}`
                                : cliente.interesses.faixaPrecoMax
                                ? `Até ${new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                  }).format(cliente.interesses.faixaPrecoMax)}`
                                : ""
                            : "";
                        return (
                            <TableRow key={cliente.id}>
                                <TableCell className="font-medium">
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
                                            {faixaPreco && (
                                                <Badge variant="outline">
                                                    {faixaPreco}
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
                                <TableCell>
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
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
