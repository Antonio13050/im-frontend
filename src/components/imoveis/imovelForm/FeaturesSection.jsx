import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FeaturesSection({ formData, onInputChange, errors }) {
    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Características</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
                <div>
                    <Label>Preço (R$) *</Label>
                    <Input
                        type="number"
                        value={formData.preco}
                        onChange={(e) => onInputChange("preco", e.target.value)}
                        placeholder="250000"
                    />
                    {errors?.["preco"] && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors["preco"]}
                        </p>
                    )}
                </div>
                <div>
                    <Label>Área (m²)</Label>
                    <Input
                        type="number"
                        value={formData.area}
                        onChange={(e) => onInputChange("area", e.target.value)}
                        placeholder="120"
                    />
                </div>
                <div>
                    <Label>Quartos</Label>
                    <Input
                        type="number"
                        value={formData.quartos}
                        onChange={(e) =>
                            onInputChange("quartos", e.target.value)
                        }
                        placeholder="3"
                    />
                </div>
                <div>
                    <Label>Banheiros</Label>
                    <Input
                        type="number"
                        value={formData.banheiros}
                        onChange={(e) =>
                            onInputChange("banheiros", e.target.value)
                        }
                        placeholder="2"
                    />
                </div>
                <div>
                    <Label>Vagas</Label>
                    <Input
                        type="number"
                        value={formData.vagas}
                        onChange={(e) => onInputChange("vagas", e.target.value)}
                        placeholder="1"
                    />
                </div>
            </div>
        </div>
    );
}
