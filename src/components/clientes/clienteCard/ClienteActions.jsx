import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export default function ClienteActions({ canEdit, onEdit, onDelete, cliente }) {
    if (!canEdit) return null;

    return (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(cliente)}
                    className="h-7 w-7 p-0"
                >
                    <Edit className="w-3 h-3" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(cliente.id)}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
}
