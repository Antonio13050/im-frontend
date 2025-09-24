import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalInfoSection({ formData, onInputChange }) {
    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Dados Pessoais</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Nome Completo *</Label>
                    <Input
                        value={formData.nome}
                        onChange={(e) => onInputChange("nome", e.target.value)}
                        placeholder="Nome completo"
                        required
                    />
                </div>

                <div>
                    <Label>E-mail</Label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onInputChange("email", e.target.value)}
                        placeholder="email@exemplo.com"
                    />
                </div>

                <div>
                    <Label>Telefone *</Label>
                    <Input
                        value={formData.telefone}
                        onChange={(e) =>
                            onInputChange("telefone", e.target.value)
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
                            onInputChange("cpfCnpj", e.target.value)
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
                            onInputChange("dataNascimento", e.target.value)
                        }
                    />
                </div>
            </div>
        </div>
    );
}
