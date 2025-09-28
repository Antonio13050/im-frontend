import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function PersonalInfoSection({
    formData,
    onInputChange,
    showDataNascimento,
    showEndereco,
}) {
    const [isBuscandoCep, setIsBuscandoCep] = useState(false);

    const formatCep = (value) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 5) return cleaned;
        return cleaned.replace(/(\d{5})(\d{0,3})/, "$1-$2");
    };

    const buscarEnderecoPorCep = async (cep) => {
        if (cep.length !== 8) return;
        setIsBuscandoCep(true);
        try {
            const response = await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );
            const data = await response.json();
            if (!data.erro) {
                onInputChange(
                    "endereco.rua",
                    data.logradouro || formData.endereco.rua
                );
                onInputChange(
                    "endereco.bairro",
                    data.bairro || formData.endereco.bairro
                );
                onInputChange(
                    "endereco.cidade",
                    data.localidade || formData.endereco.cidade
                );
                onInputChange(
                    "endereco.estado",
                    data.uf || formData.endereco.estado
                );
            } else {
                console.error("CEP não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        } finally {
            setIsBuscandoCep(false);
        }
    };

    const handleCepChange = (e) => {
        const formatted = formatCep(e.target.value);
        onInputChange("endereco.cep", formatted);
        const cleanCep = formatted.replace(/\D/g, "");
        if (/^\d{8}$/.test(cleanCep)) {
            buscarEnderecoPorCep(cleanCep);
        }
    };
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
                        placeholder="Nome completo"
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
                        placeholder="email@exemplo.com"
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
                        placeholder="(11) 99999-9999"
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
                        placeholder="000.000.000-00"
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
                            <Label htmlFor="endereco.cep">CEP</Label>
                            <div className="relative">
                                <Input
                                    id="endereco.cep"
                                    value={formData.endereco.cep}
                                    onChange={handleCepChange}
                                    placeholder="00000-000"
                                    maxLength={9}
                                    className="mt-2"
                                />
                                {isBuscandoCep && (
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-blue-600 mt-1">
                                💡 Preencha o CEP para busca automática do
                                endereço
                            </p>
                        </div>
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
                                placeholder="Nome da rua"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="endereco.numero">Número</Label>
                            <Input
                                value={formData.endereco.numero}
                                onChange={(e) =>
                                    onInputChange(
                                        "endereco.numero",
                                        e.target.value
                                    )
                                }
                                className="mt-2"
                                placeholder="123"
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
                                placeholder="Nome do bairro"
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
                                placeholder="Nome da cidade"
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
                                placeholder="SP"
                                maxLength={2}
                                className="mt-2"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
