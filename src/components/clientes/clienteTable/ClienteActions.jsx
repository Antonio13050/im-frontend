import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClienteActions({ canEdit, onEdit, onDelete, cliente }) {
    if (!canEdit) return null;

    return (
        <div className="flex gap-1">
            <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(cliente)}
                className="h-7 w-7 p-0"
                aria-label={`Editar cliente ${cliente.nome}`}
            >
                <Edit className="w-3 h-3" />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                asChild
                aria-label={`Ver detalhes do cliente ${cliente.nome}`}
            >
                <Link to={`/cliente-detalhes/${cliente.id}`}>
                    <Eye className="w-3 h-3" />
                </Link>
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(cliente.id)}
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                aria-label={`Excluir cliente ${cliente.nome}`}
            >
                <Trash2 className="w-3 h-3" />
            </Button>
        </div>
    );
}
