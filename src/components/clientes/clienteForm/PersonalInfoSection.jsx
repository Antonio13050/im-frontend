import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalInfoSection({ formData, onInputChange }) {
    return (
        <div className="space-y-6">
            <Label className="text-xl font-bold">Dados Pessoais</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Nome Completo *
                    </Label>
                    <Input
                        value={formData.nome}
                        onChange={(e) => onInputChange("nome", e.target.value)}
                        placeholder="Nome completo"
                        required
                        className="mt-2"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">E-mail</Label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onInputChange("email", e.target.value)}
                        placeholder="email@exemplo.com"
                        className="mt-2"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Telefone *</Label>
                    <Input
                        value={formData.telefone}
                        onChange={(e) =>
                            onInputChange("telefone", e.target.value)
                        }
                        placeholder="(11) 99999-9999"
                        required
                        className="mt-2"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">CPF/CNPJ</Label>
                    <Input
                        value={formData.cpfCnpj}
                        onChange={(e) =>
                            onInputChange("cpfCnpj", e.target.value)
                        }
                        placeholder="000.000.000-00"
                        className="mt-2"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Data de Nascimento
                    </Label>
                    <Input
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) =>
                            onInputChange("dataNascimento", e.target.value)
                        }
                        className="mt-2"
                    />
                </div>
            </div>
        </div>
    );
}
