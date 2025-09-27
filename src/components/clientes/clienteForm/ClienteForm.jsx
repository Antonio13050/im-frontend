import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PersonalInfoSection from "./PersonalInfoSection";
import InterestsSection from "./InterestsSection";
import ObservationsSection from "./ObservationsSection";

export default function ClienteForm({
    cliente,
    onSave,
    onCancel,
    currentUser,
}) {
    const [formData, setFormData] = useState({
        nome: cliente?.nome || "",
        email: cliente?.email || "",
        telefone: cliente?.telefone || "",
        cpfCnpj: cliente?.cpfCnpj || "",
        dataNascimento: cliente?.dataNascimento || "",
        createdDate: cliente?.createdDate || "",
        interesses: {
            tiposImovel: cliente?.interesses?.tiposImovel || [],
            faixaPrecoMin: cliente?.interesses?.faixaPrecoMin || "",
            faixaPrecoMax: cliente?.interesses?.faixaPrecoMax || "",
            bairrosInteresse: cliente?.interesses?.bairrosInteresse || [],
            finalidade: cliente?.interesses?.finalidade || "venda",
        },
        observacoes: cliente?.observacoes || "",
        corretorId: cliente?.corretorId
            ? String(cliente.corretorId)
            : String(currentUser?.sub),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = useCallback((field, value) => {
        if (field.startsWith("interesses.")) {
            const interestField = field.replace("interesses.", "");
            setFormData((prev) => ({
                ...prev,
                interesses: {
                    ...prev.interesses,
                    [interestField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dataToSubmit = {
                ...formData,
                interesses: {
                    ...formData.interesses,
                    faixaPrecoMin:
                        parseFloat(formData.interesses.faixaPrecoMin) || null,
                    faixaPrecoMax:
                        parseFloat(formData.interesses.faixaPrecoMax) || null,
                },
            };
            await onSave(dataToSubmit);
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {cliente ? "Editar Cliente" : "Novo Cliente"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <PersonalInfoSection
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                    <InterestsSection
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                    <ObservationsSection
                        formData={formData}
                        onInputChange={handleInputChange}
                    />

                    <div className="flex justify-end gap-4 pt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="px-4 py-2"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2"
                        >
                            {isSubmitting ? "Salvando..." : "Salvar Cliente"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
