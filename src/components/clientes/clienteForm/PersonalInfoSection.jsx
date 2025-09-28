import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalInfoSection({
    formData,
    onInputChange,
    showDataNascimento,
    showEndereco,
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => onInputChange("nome", e.target.value)}
                        className="mt-2"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => onInputChange("email", e.target.value)}
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) =>
                            onInputChange("telefone", e.target.value)
                        }
                        className="mt-2"
                    />
                </div>
                <div>
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input
                        id="cpfCnpj"
                        value={formData.cpfCnpj}
                        onChange={(e) =>
                            onInputChange("cpfCnpj", e.target.value)
                        }
                        className="mt-2"
                    />
                </div>
                {showDataNascimento && (
                    <div>
                        <Label htmlFor="dataNascimento">
                            Data de Nascimento
                        </Label>
                        <Input
                            id="dataNascimento"
                            type="date"
                            value={formData.dataNascimento}
                            onChange={(e) =>
                                onInputChange("dataNascimento", e.target.value)
                            }
                            className="mt-2"
                        />
                    </div>
                )}
                {showEndereco && (
                    <>
                        <div>
                            <Label htmlFor="endereco.rua">Rua</Label>
                            <Input
                                id="endereco.rua"
                                value={formData.endereco.rua}
                                onChange={(e) =>
                                    onInputChange(
                                        "endereco.rua",
                                        e.target.value
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="endereco.bairro">Bairro</Label>
                            <Input
                                id="endereco.bairro"
                                value={formData.endereco.bairro}
                                onChange={(e) =>
                                    onInputChange(
                                        "endereco.bairro",
                                        e.target.value
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="endereco.cidade">Cidade</Label>
                            <Input
                                id="endereco.cidade"
                                value={formData.endereco.cidade}
                                onChange={(e) =>
                                    onInputChange(
                                        "endereco.cidade",
                                        e.target.value
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="endereco.estado">Estado</Label>
                            <Input
                                id="endereco.estado"
                                value={formData.endereco.estado}
                                onChange={(e) =>
                                    onInputChange(
                                        "endereco.estado",
                                        e.target.value
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="endereco.cep">CEP</Label>
                            <Input
                                id="endereco.cep"
                                value={formData.endereco.cep}
                                onChange={(e) =>
                                    onInputChange(
                                        "endereco.cep",
                                        e.target.value
                                    )
                                }
                                className="mt-2"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
