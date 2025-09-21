import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function CorretorForm({
    corretor,
    onSave,
    onCancel,
    currentUser,
    allUsers,
}) {
    const [formData, setFormData] = useState({
        nome: corretor?.nome || "",
        email: corretor?.email || "",
        senha: "",
        telefone: corretor?.telefone || "",
        creci: corretor?.creci || "",
        perfil: corretor?.roles[0].nome?.toUpperCase() || "CORRETOR",
        ativo: corretor?.ativo !== false,
        gerenteId: corretor?.gerenteId || "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gerentes, setGerentes] = useState([]);

    useEffect(() => {
        if (allUsers) {
            setGerentes(allUsers.filter((u) => u.roles[0].nome === "GERENTE"));
        }
    }, [allUsers]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dataToSave = {
                ...formData,
                role: formData.perfil, // Enviar como "role" para o backend
            };
            // Apenas corretores podem ter um gerente responsável
            if (dataToSave.perfil !== "CORRETOR") {
                dataToSave.gerenteId = null;
            }
            await onSave(dataToSave);
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            alert("Erro ao salvar: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canEditProfile = currentUser?.perfil === "ADMIN";
    const isEditingMode = !!corretor;
    const selectedPerfil = formData.perfil;

    // Determinar o título do modal baseado no perfil
    const getModalTitle = () => {
        if (isEditingMode) {
            return selectedPerfil === "GERENTE"
                ? "Editar Gerente"
                : "Editar Corretor";
        }
        return selectedPerfil === "GERENTE" ? "Novo Gerente" : "Novo Corretor";
    };

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{getModalTitle()}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Nome Completo *</Label>
                        <Input
                            value={formData.nome}
                            onChange={(e) =>
                                handleInputChange("nome", e.target.value)
                            }
                            placeholder="Nome completo"
                            required
                        />
                    </div>

                    <div>
                        <Label>E-mail *</Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                handleInputChange("email", e.target.value)
                            }
                            placeholder="email@exemplo.com"
                            required
                        />
                    </div>

                    {!isEditingMode && (
                        <div>
                            <Label>Senha *</Label>
                            <Input
                                type="password"
                                value={formData.senha}
                                onChange={(e) =>
                                    handleInputChange("senha", e.target.value)
                                }
                                placeholder="Senha"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <Label>Telefone</Label>
                        <Input
                            value={formData.telefone}
                            onChange={(e) =>
                                handleInputChange("telefone", e.target.value)
                            }
                            placeholder="(11) 99999-9999"
                        />
                    </div>

                    <div>
                        <Label>CRECI</Label>
                        <Input
                            value={formData.creci}
                            onChange={(e) =>
                                handleInputChange("creci", e.target.value)
                            }
                            placeholder="12345-J"
                        />
                    </div>

                    <div>
                        <Label>Perfil *</Label>
                        <Select
                            value={formData.perfil}
                            onValueChange={(value) =>
                                handleInputChange("perfil", value.toUpperCase())
                            }
                            disabled={!canEditProfile}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CORRETOR">
                                    Corretor
                                </SelectItem>
                                <SelectItem value="GERENTE">Gerente</SelectItem>
                                {currentUser?.perfil === "ADMIN" && (
                                    <SelectItem value="ADMIN">
                                        Administrador
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {!canEditProfile && (
                            <p className="text-xs text-gray-500 mt-1">
                                Apenas admins podem alterar o perfil.
                            </p>
                        )}
                    </div>

                    {/* Campo gerente só aparece para corretores */}
                    {formData.perfil === "CORRETOR" && canEditProfile && (
                        <div>
                            <Label>Gerente Responsável</Label>
                            <Select
                                value={formData.gerenteId || ""}
                                onValueChange={(value) =>
                                    handleInputChange(
                                        "gerenteId",
                                        value === "none" ? null : Number(value)
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um gerente (opcional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Nenhum gerente
                                    </SelectItem>
                                    {gerentes.map((g) => (
                                        <SelectItem
                                            key={g.userId}
                                            value={g.userId}
                                        >
                                            {g.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Explicação para gerentes */}
                    {formData.perfil === "GERENTE" && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <strong>Gerentes</strong> podem visualizar e
                                gerenciar os corretores de sua equipe, bem como
                                todos os imóveis e clientes vinculados a esses
                                corretores.
                            </p>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="ativo"
                            checked={formData.ativo}
                            onCheckedChange={(checked) =>
                                handleInputChange("ativo", checked)
                            }
                        />
                        <Label htmlFor="ativo">Usuário ativo</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
