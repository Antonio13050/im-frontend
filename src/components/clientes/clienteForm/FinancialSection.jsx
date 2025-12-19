import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Building2, CreditCard, AlertCircle } from "lucide-react";

export default function FinancialSection({ formData, onInputChange, errors }) {
    const formatCurrency = (value) => {
        if (!value) return "";
        const cleaned = value.toString().replace(/\D/g, "");
        const number = parseFloat(cleaned) / 100;
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        }).format(number);
    };

    const handleCurrencyInput = (field, value) => {
        const cleaned = value.replace(/\D/g, "");
        onInputChange(field, cleaned);
    };

    const formatCurrencyValue = (value) => {
        if (!value) return "";
        const cleaned = value.toString().replace(/\D/g, "");
        if (cleaned === "") return "";
        const number = parseFloat(cleaned) / 100;
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        }).format(number);
    };

    return (
        <div className="space-y-6">
            {/* Renda e Profissão */}
            <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <Label className="text-lg font-semibold">Renda e Profissão</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="rendaMensal">Renda Mensal</Label>
                        <Input
                            id="rendaMensal"
                            value={
                                formData.rendaMensal
                                    ? formatCurrencyValue(formData.rendaMensal)
                                    : ""
                            }
                            onChange={(e) =>
                                handleCurrencyInput("rendaMensal", e.target.value)
                            }
                            placeholder="R$ 0,00"
                            className="mt-2"
                        />
                        {errors?.rendaMensal && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.rendaMensal}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="profissaoFinanceiro">Profissão/Emprego Atual</Label>
                        <Input
                            id="profissaoFinanceiro"
                            value={formData.profissao || ""}
                            onChange={(e) => onInputChange("profissao", e.target.value)}
                            placeholder="Ex: Engenheiro, Médico, Empresário"
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            {/* Referências Bancárias */}
            <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold">
                        Referências Bancárias
                    </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="banco">Banco</Label>
                        <Input
                            id="banco"
                            value={formData.banco || ""}
                            onChange={(e) => onInputChange("banco", e.target.value)}
                            placeholder="Ex: Banco do Brasil, Bradesco"
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="agencia">Agência</Label>
                        <Input
                            id="agencia"
                            value={formData.agencia || ""}
                            onChange={(e) => onInputChange("agencia", e.target.value)}
                            placeholder="0000"
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="conta">Conta</Label>
                        <Input
                            id="conta"
                            value={formData.conta || ""}
                            onChange={(e) => onInputChange("conta", e.target.value)}
                            placeholder="00000-0"
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            {/* Histórico de Crédito */}
            <div className="border-b pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <Label className="text-lg font-semibold">Histórico de Crédito</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="scoreCredito">Score de Crédito</Label>
                        <Input
                            id="scoreCredito"
                            type="number"
                            min="0"
                            max="1000"
                            value={formData.scoreCredito || ""}
                            onChange={(e) =>
                                onInputChange("scoreCredito", e.target.value)
                            }
                            placeholder="Ex: 750"
                            className="mt-2"
                        />
                        {errors?.scoreCredito && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.scoreCredito}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Pontuação de 0 a 1000
                        </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-8">
                        <Checkbox
                            id="restricoesFinanceiras"
                            checked={formData.restricoesFinanceiras || false}
                            onCheckedChange={(checked) =>
                                onInputChange("restricoesFinanceiras", checked)
                            }
                        />
                        <Label
                            htmlFor="restricoesFinanceiras"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Possui restrições financeiras
                        </Label>
                    </div>
                </div>
            </div>

            {/* Observações Financeiras */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <Label className="text-lg font-semibold">
                        Observações Financeiras
                    </Label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <Textarea
                        value={formData.observacoesFinanceiras || ""}
                        onChange={(e) =>
                            onInputChange("observacoesFinanceiras", e.target.value)
                        }
                        placeholder="Informações adicionais sobre a situação financeira do cliente..."
                        rows={4}
                        className="bg-white"
                    />
                    <p className="text-xs text-yellow-700 mt-2">
                        ⚠️ Estas observações são visíveis apenas para a equipe interna
                    </p>
                </div>
            </div>
        </div>
    );
}
