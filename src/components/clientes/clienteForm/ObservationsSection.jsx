import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ObservationsSection({ formData, onInputChange }) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">Observações</Label>
            <Textarea
                value={formData.observacoes}
                onChange={(e) => onInputChange("observacoes", e.target.value)}
                placeholder="Observações sobre o cliente..."
                rows={4}
                className="mt-2"
            />
        </div>
    );
}
