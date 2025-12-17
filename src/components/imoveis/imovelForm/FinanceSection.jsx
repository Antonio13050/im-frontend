import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Percent, CreditCard, Home } from "lucide-react";

export default function FinanceSection({ formData, onInputChange, errors }) {
    const formatCurrency = (value) => {
        if (!value) return "";
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value;
        return numValue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const parseCurrency = (value) => {
        if (!value) return "";
        return value.replace(/[^\d,]/g, "").replace(",", ".");
    };

    return (
        <div className="space-y-6">
            {/* Preços */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <Label className="text-lg font-semibold">Valores</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Preço de Venda */}
                    {(formData.finalidade === "venda" ||
                        formData.finalidade === "venda_aluguel") && (
                            <div>
                                <Label>Preço de Venda (R$) *</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.precoVenda}
                                    onChange={(e) =>
                                        onInputChange("precoVenda", e.target.value)
                                    }
                                    placeholder="500000.00"
                                />
                                {errors?.["precoVenda"] && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors["precoVenda"]}
                                    </p>
                                )}
                            </div>
                        )}

                    {/* Preço de Aluguel */}
                    {(formData.finalidade === "aluguel" ||
                        formData.finalidade === "venda_aluguel") && (
                            <div>
                                <Label>Valor do Aluguel (R$/mês) *</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.precoAluguel}
                                    onChange={(e) =>
                                        onInputChange("precoAluguel", e.target.value)
                                    }
                                    placeholder="2500.00"
                                />
                                {errors?.["precoAluguel"] && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors["precoAluguel"]}
                                    </p>
                                )}
                            </div>
                        )}

                    {/* Preço Temporada */}
                    {formData.finalidade === "temporada" && (
                        <div>
                            <Label>Valor Temporada (R$/diária)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.precoTemporada}
                                onChange={(e) =>
                                    onInputChange("precoTemporada", e.target.value)
                                }
                                placeholder="350.00"
                            />
                        </div>
                    )}

                    {/* Condomínio */}
                    <div>
                        <Label>Condomínio (R$/mês)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.valorCondominio}
                            onChange={(e) =>
                                onInputChange("valorCondominio", e.target.value)
                            }
                            placeholder="800.00"
                        />
                    </div>

                    {/* IPTU Anual */}
                    <div>
                        <Label>IPTU (R$/ano)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.valorIptu}
                            onChange={(e) =>
                                onInputChange("valorIptu", e.target.value)
                            }
                            placeholder="2400.00"
                        />
                        {formData.valorIptu && (
                            <p className="text-xs text-gray-500 mt-1">
                                ≈ R$ {(parseFloat(formData.valorIptu) / 12).toFixed(2)}/mês
                            </p>
                        )}
                    </div>

                    {/* Valor Entrada */}
                    {formData.finalidade === "venda" && (
                        <div>
                            <Label>Entrada Mínima (R$)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.valorEntrada}
                                onChange={(e) =>
                                    onInputChange("valorEntrada", e.target.value)
                                }
                                placeholder="100000.00"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Opções de Negociação */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold">Opções de Negociação</Label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="aceitaFinanciamento"
                            checked={formData.aceitaFinanciamento || false}
                            onCheckedChange={(checked) =>
                                onInputChange("aceitaFinanciamento", checked)
                            }
                        />
                        <Label htmlFor="aceitaFinanciamento" className="cursor-pointer">
                            Aceita Financiamento
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="aceitaFgts"
                            checked={formData.aceitaFgts || false}
                            onCheckedChange={(checked) =>
                                onInputChange("aceitaFgts", checked)
                            }
                        />
                        <Label htmlFor="aceitaFgts" className="cursor-pointer">
                            Aceita FGTS
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="aceitaPermuta"
                            checked={formData.aceitaPermuta || false}
                            onCheckedChange={(checked) =>
                                onInputChange("aceitaPermuta", checked)
                            }
                        />
                        <Label htmlFor="aceitaPermuta" className="cursor-pointer">
                            Aceita Permuta
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="posseImediata"
                            checked={formData.posseImediata ?? true}
                            onCheckedChange={(checked) =>
                                onInputChange("posseImediata", checked)
                            }
                        />
                        <Label htmlFor="posseImediata" className="cursor-pointer">
                            Posse Imediata
                        </Label>
                    </div>
                </div>
            </div>

            {/* Comissões */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Percent className="w-5 h-5 text-purple-600" />
                    <Label className="text-lg font-semibold">Comissões</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Comissão Venda (%)</Label>
                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={formData.comissaoVenda}
                            onChange={(e) =>
                                onInputChange("comissaoVenda", e.target.value)
                            }
                            placeholder="6"
                        />
                        {formData.precoVenda && formData.comissaoVenda && (
                            <p className="text-xs text-green-600 mt-1">
                                ≈ R${" "}
                                {(
                                    (parseFloat(formData.precoVenda) *
                                        parseFloat(formData.comissaoVenda)) /
                                    100
                                ).toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Comissão Aluguel (%)</Label>
                        <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={formData.comissaoAluguel}
                            onChange={(e) =>
                                onInputChange("comissaoAluguel", e.target.value)
                            }
                            placeholder="100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Geralmente 100% do primeiro aluguel
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
