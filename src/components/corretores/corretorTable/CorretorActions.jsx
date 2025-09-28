import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, UserCheck, UserX } from "lucide-react";

export default function CorretorActions({
    canEdit,
    onEdit,
    onToggleStatus,
    corretor,
}) {
    return (
        <div className="flex justify-center gap-2">
            {canEdit && (
                <Button
                    variant="outline"
                    size="ghost"
                    onClick={() => onEdit(corretor)}
                    className="flex items-center gap-1"
                    aria-label="Editar corretor"
                >
                    <Edit className="w-3 h-3" />
                </Button>
            )}
        </div>
    );
}
