import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export default function ImovelActions({ canEdit, onEdit, onDelete, imovel }) {
    if (!canEdit) return null;

    return (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(imovel);
                }}
                className="h-7 w-7 p-0"
            >
                <Edit className="w-3 h-3" />
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(imovel.id);
                }}
                className="h-7 w-7 p-0"
            >
                <Trash2 className="w-3 h-3" />
            </Button>
        </div>
    );
}
