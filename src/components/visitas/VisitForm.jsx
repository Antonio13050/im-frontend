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

export default function VisitForm({
    visit,
    onSubmit,
    setOpen,
    clients = [],
    properties = [],
}) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (visit) {
            const clienteId = visit.clienteId
                ? String(visit.clienteId)
                : findClientByName(visit.clientName) || "";
            const imovelId = visit.imovelId ? String(visit.imovelId) : "";

            setFormData({
                ...visit,
                imovelId,
                clienteId,
                scheduledDate: visit.scheduledDate
                    ? new Date(visit.scheduledDate).toISOString().split("T")[0]
                    : "",
                scheduledTime: visit.scheduledTime || "",
                notes: visit.notes || "",
            });
        } else {
            setFormData({
                imovelId: "",
                clienteId: "",
                scheduledDate: "",
                scheduledTime: "",
                notes: "",
            });
        }
    }, [visit, clients, properties]);

    const findClientByName = (clientName) => {
        if (!clientName || !clients || clients.length === 0) return "";
        const client = clients.find((c) => c.nome === clientName);
        return String(client?.id || "");
    };

    const handleChange = (field, value) => {
        if (value === "" && field !== "notes") {
            console.warn(`handleChange: Ignorando valor vazio para ${field}`);
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.imovelId ||
            !formData.clienteId ||
            !formData.scheduledDate ||
            !formData.scheduledTime
        ) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const selectedClient = clients.find((c) => c.id == formData.clienteId);
        const selectedProperty = properties.find(
            (p) => p.id == formData.imovelId
        );

        if (!selectedClient || !selectedProperty) {
            alert("Imóvel ou cliente selecionado é inválido.");
            return;
        }

        const submitData = {
            ...formData,
            scheduledDate: new Date(formData.scheduledDate)
                .toISOString()
                .split("T")[0],
            clientName: selectedClient.nome || "",
            clientPhone: selectedClient.telefone || "",
            clientEmail: selectedClient.email || "",
        };
        onSubmit(submitData);
    };

    const selectedClient = clients.find((c) => c.id == formData.clienteId);

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
                            {properties.length > 0 ? (
                                properties.map((prop) => (
                                    <SelectItem
                                        key={prop.id}
                                        value={String(prop.id)}
                                    >
                                        {prop.titulo}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="" disabled>
                                    Nenhum imóvel disponível
                                </SelectItem>
                            )}
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
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {clients.length > 0 ? (
                                clients.map((client) => (
                                    <SelectItem
                                        key={client.id}
                                        value={String(client.id)}
                                    >
                                        {client.nome}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="" disabled>
                                    Nenhum cliente disponível
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="scheduledDate">Data da Visita *</Label>
                    <Input
                        id="scheduledDate"
                        type="date"
                        value={formData.scheduledDate || ""}
                        onChange={(e) =>
                            handleChange("scheduledDate", e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="scheduledTime">Horário *</Label>
                    <Input
                        id="scheduledTime"
                        type="time"
                        value={formData.scheduledTime || ""}
                        onChange={(e) =>
                            handleChange("scheduledTime", e.target.value)
                        }
                        required
                    />
                </div>
            </div>

            {selectedClient && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">
                        Informações do Cliente
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                            <strong>Nome:</strong>{" "}
                            {selectedClient.nome || "N/A"}
                        </div>
                        <div>
                            <strong>Telefone:</strong>{" "}
                            {selectedClient.telefone || "N/A"}
                        </div>
                        {selectedClient.email && (
                            <div>
                                <strong>Email:</strong> {selectedClient.email}
                            </div>
                        )}
                        {selectedClient.address && (
                            <div>
                                <strong>Endereço:</strong>{" "}
                                {selectedClient.address}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Adicione observações sobre a visita..."
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
                    {visit ? "Atualizar" : "Salvar"} Visita
                </Button>
            </div>
        </form>
    );
}
