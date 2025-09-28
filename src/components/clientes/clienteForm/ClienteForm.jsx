import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        perfil: cliente?.perfil || "CLIENTE",
        corretorId: cliente?.corretorId
            ? String(cliente.corretorId)
            : String(currentUser?.sub),
        endereco: cliente?.endereco || {
            rua: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
        },
        interesses: cliente?.interesses || {
            tiposImovel: [],
            faixaPrecoMin: "",
            faixaPrecoMax: "",
            bairrosInteresse: [],
            finalidade: "venda",
        },
        observacoes: cliente?.observacoes || "",
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
        } else if (field.startsWith("endereco.")) {
            const enderecoField = field.replace("endereco.", "");
            setFormData((prev) => ({
                ...prev,
                endereco: {
                    ...prev.endereco,
                    [enderecoField]: value,
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

    const showInteresses = ["CLIENTE", "LOCATARIO"].includes(formData.perfil);
    const showDataNascimento = formData.perfil !== "CORRETOR_PARCEIRO";
    const showEndereco = formData.perfil !== "CORRETOR_PARCEIRO";
    const isLocatario = formData.perfil === "LOCATARIO";

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {cliente ? "Editar Cliente" : "Novo Cliente"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Perfil
                        </label>
                        <Select
                            value={formData.perfil}
                            onValueChange={(value) =>
                                handleInputChange("perfil", value)
                            }
                            required
                        >
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CLIENTE">Cliente</SelectItem>
                                <SelectItem value="PROPRIETARIO">
                                    Proprietário
                                </SelectItem>
                                <SelectItem value="LOCATARIO">
                                    Locatário
                                </SelectItem>
                                <SelectItem value="FIADOR">Fiador</SelectItem>
                                <SelectItem value="CORRETOR_PARCEIRO">
                                    Corretor Parceiro
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <PersonalInfoSection
                        formData={formData}
                        onInputChange={handleInputChange}
                        showDataNascimento={showDataNascimento}
                        showEndereco={showEndereco}
                    />

                    {showInteresses && (
                        <InterestsSection
                            formData={formData}
                            onInputChange={handleInputChange}
                            isLocatario={isLocatario}
                        />
                    )}

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
