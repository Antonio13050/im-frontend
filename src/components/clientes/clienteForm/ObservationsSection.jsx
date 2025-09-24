import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ObservationsSection({ formData, onInputChange }) {
    return (
        <div>
            <Label>Observações</Label>
            <Textarea
                value={formData.observacoes}
                onChange={(e) => onInputChange("observacoes", e.target.value)}
                placeholder="Observações sobre o cliente..."
                rows={3}
            />
        </div>
    );
}
