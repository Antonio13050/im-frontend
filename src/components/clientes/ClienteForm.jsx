import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function ClienteForm({ cliente, onSave, onCancel }) {
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
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newBairro, setNewBairro] = useState("");

    const tiposImovel = [
        { value: "casa", label: "Casa" },
        { value: "apartamento", label: "Apartamento" },
        { value: "terreno", label: "Terreno" },
        { value: "comercial", label: "Comercial" },
        { value: "galpao", label: "Galpão" },
        { value: "chacara", label: "Chácara" },
    ];

    const handleInputChange = (field, value) => {
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
    };

    const handleTipoImovelChange = (tipo, checked) => {
        setFormData((prev) => ({
            ...prev,
            interesses: {
                ...prev.interesses,
                tiposImovel: checked
                    ? [...prev.interesses.tiposImovel, tipo]
                    : prev.interesses.tiposImovel.filter((t) => t !== tipo),
            },
        }));
    };

    const addBairro = () => {
        if (
            newBairro.trim() &&
            !formData.interesses.bairrosInteresse.includes(newBairro.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                interesses: {
                    ...prev.interesses,
                    bairrosInteresse: [
                        ...prev.interesses.bairrosInteresse,
                        newBairro.trim(),
                    ],
                },
            }));
            setNewBairro("");
        }
    };

    const removeBairro = (index) => {
        setFormData((prev) => ({
            ...prev,
            interesses: {
                ...prev.interesses,
                bairrosInteresse: prev.interesses.bairrosInteresse.filter(
                    (_, i) => i !== index
                ),
            },
        }));
    };

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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {cliente ? "Editar Cliente" : "Novo Cliente"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">
                            Dados Pessoais
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nome Completo *</Label>
                                <Input
                                    value={formData.nome}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "nome",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nome completo"
                                    required
                                />
                            </div>

                            <div>
                                <Label>E-mail</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="email@exemplo.com"
                                />
                            </div>

                            <div>
                                <Label>Telefone *</Label>
                                <Input
                                    value={formData.telefone}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "telefone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="(11) 99999-9999"
                                    required
                                />
                            </div>

                            <div>
                                <Label>CPF/CNPJ</Label>
                                <Input
                                    value={formData.cpfCnpj}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "cpfCnpj",
                                            e.target.value
                                        )
                                    }
                                    placeholder="000.000.000-00"
                                />
                            </div>

                            <div>
                                <Label>Data de Nascimento</Label>
                                <Input
                                    type="date"
                                    value={formData.dataNascimento}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "dataNascimento",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Interesses */}
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">
                            Interesses
                        </Label>

                        <div>
                            <Label>Finalidade</Label>
                            <Select
                                value={formData.interesses.finalidade}
                                onValueChange={(value) =>
                                    handleInputChange(
                                        "interesses.finalidade",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="venda">
                                        Compra
                                    </SelectItem>
                                    <SelectItem value="aluguel">
                                        Aluguel
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Tipos de Imóvel</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                {tiposImovel.map((tipo) => (
                                    <div
                                        key={tipo.value}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={tipo.value}
                                            checked={formData.interesses.tiposImovel.includes(
                                                tipo.value
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleTipoImovelChange(
                                                    tipo.value,
                                                    checked
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={tipo.value}
                                            className="text-sm"
                                        >
                                            {tipo.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Preço Mínimo (R$)</Label>
                                <Input
                                    type="number"
                                    value={formData.interesses.faixaPrecoMin}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "interesses.faixaPrecoMin",
                                            e.target.value
                                        )
                                    }
                                    placeholder="100000"
                                />
                            </div>
                            <div>
                                <Label>Preço Máximo (R$)</Label>
                                <Input
                                    type="number"
                                    value={formData.interesses.faixaPrecoMax}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "interesses.faixaPrecoMax",
                                            e.target.value
                                        )
                                    }
                                    placeholder="500000"
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Bairros de Interesse</Label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={newBairro}
                                    onChange={(e) =>
                                        setNewBairro(e.target.value)
                                    }
                                    placeholder="Digite um bairro"
                                    onKeyPress={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(), addBairro())
                                    }
                                />
                                <Button
                                    type="button"
                                    onClick={addBairro}
                                    variant="outline"
                                >
                                    Adicionar
                                </Button>
                            </div>
                            {formData.interesses.bairrosInteresse.length >
                                0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.interesses.bairrosInteresse.map(
                                        (bairro, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                                            >
                                                {bairro}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeBairro(index)
                                                    }
                                                    className="ml-1 hover:text-blue-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observações */}
                    <div>
                        <Label>Observações</Label>
                        <Textarea
                            value={formData.observacoes}
                            onChange={(e) =>
                                handleInputChange("observacoes", e.target.value)
                            }
                            placeholder="Observações sobre o cliente..."
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar Cliente"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
