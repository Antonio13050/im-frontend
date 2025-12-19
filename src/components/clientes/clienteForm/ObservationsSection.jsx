import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, AlertCircle } from "lucide-react";

export default function ObservationsSection({ formData, onInputChange }) {
    return (
        <div className="space-y-6">
            {/* Observações Gerais */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold">Observações Gerais</Label>
                </div>
                <Textarea
                    value={formData.observacoes || ""}
                    onChange={(e) => onInputChange("observacoes", e.target.value)}
                    placeholder="Observações gerais sobre o cliente..."
                    rows={4}
                    className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-2">
                    Estas observações podem ser compartilhadas com a equipe
                </p>
            </div>

            {/* Observações Internas */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <Label className="text-lg font-semibold">Observações Internas</Label>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <Textarea
                        value={formData.observacoesInternas || ""}
                        onChange={(e) =>
                            onInputChange("observacoesInternas", e.target.value)
                        }
                        placeholder="Notas internas sobre o cliente (não visíveis para clientes)..."
                        rows={4}
                        className="bg-white"
                    />
                    <p className="text-xs text-yellow-700 mt-2">
                        ⚠️ Estas observações são visíveis apenas para a equipe interna
                    </p>
                </div>
            </div>
        </div>
    );
}