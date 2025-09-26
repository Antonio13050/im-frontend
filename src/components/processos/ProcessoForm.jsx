import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save, X } from "lucide-react";

export default function ProcessForm({
    processo,
    onSubmit,
    setOpen,
    clientes,
    imoveis,
    currentUser,
}) {
    const [formData, setFormData] = useState({
        status: processo?.status || "interesse_manifestado",
        imovelId: String(processo?.imovel.id || ""),
        clienteId: String(processo?.cliente.id || ""),
        valorProposto: processo?.valorProposto || "",
        tipoFinanciamento: processo?.tipoFinanciamento || "vista",
        nomeBanco: processo?.nomeBanco || "",
        observacoes: processo?.observacoes || "",
        corretorId: String(processo?.corretorId || currentUser?.sub || ""),
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="imovelId">Imóvel *</Label>
                    <Select
                        value={formData.imovelId || ""}
                        onValueChange={(value) =>
                            handleChange("imovelId", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um imóvel" />
                        </SelectTrigger>
                        <SelectContent>
                            {imoveis &&
                                imoveis.map((prop) => (
                                    <SelectItem
                                        key={prop.id}
                                        value={String(prop.id)}
                                    >
                                        {prop.titulo}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="clienteId">Cliente *</Label>
                    <Select
                        value={formData.clienteId || ""}
                        onValueChange={(value) =>
                            handleChange("clienteId", value)
                        }
                    >
                        <SelectTrigger id="clienteId">
                            <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {clientes &&
                                clientes.map((cliente) => (
                                    <SelectItem
                                        key={cliente.id}
                                        value={String(cliente.id)}
                                    >
                                        {cliente.nome}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="valorProposto">Valor Proposto (R$)</Label>
                    <Input
                        id="valorProposto"
                        type="number"
                        step="0.01"
                        value={formData.valorProposto || ""}
                        onChange={(e) =>
                            handleChange(
                                "valorProposto",
                                parseFloat(e.target.value) || ""
                            )
                        }
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <Label htmlFor="tipoFinanciamento">
                        Tipo de Financiamento
                    </Label>
                    <Select
                        value={formData.tipoFinanciamento}
                        onValueChange={(value) =>
                            handleChange("tipoFinanciamento", value)
                        }
                    >
                        <SelectTrigger id="tipoFinanciamento">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vista">À Vista</SelectItem>
                            <SelectItem value="financiamento">
                                Financiamento
                            </SelectItem>
                            <SelectItem value="consorcio">Consórcio</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {formData.tipoFinanciamento === "financiamento" && (
                    <div>
                        <Label htmlFor="nomeBanco">Nome do Banco</Label>
                        <Input
                            id="nomeBanco"
                            value={formData.nomeBanco || ""}
                            onChange={(e) =>
                                handleChange("nomeBanco", e.target.value)
                            }
                            placeholder="Ex: Banco do Brasil"
                        />
                    </div>
                )}
            </div>

            <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                    id="observacoes"
                    value={formData.observacoes || ""}
                    onChange={(e) =>
                        handleChange("observacoes", e.target.value)
                    }
                    placeholder="Adicione observações sobre o processo..."
                    rows={3}
                />
            </div>

            <div className="flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    {processo ? "Atualizar" : "Salvar"} Processo
                </Button>
            </div>
        </form>
    );
}
