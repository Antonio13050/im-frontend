import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Bed,
    Bath,
    Car,
    Square,
    Calendar,
    Plus,
    X,
    Home,
    Zap,
} from "lucide-react";

// Comodidades pré-definidas por categoria
const COMODIDADES_PADRAO = {
    lazer: [
        { value: "piscina", label: "Piscina" },
        { value: "churrasqueira", label: "Churrasqueira" },
        { value: "playground", label: "Playground" },
        { value: "salao_festas", label: "Salão de Festas" },
        { value: "quadra", label: "Quadra Esportiva" },
        { value: "sauna", label: "Sauna" },
        { value: "academia", label: "Academia" },
        { value: "espaco_gourmet", label: "Espaço Gourmet" },
    ],
    conforto: [
        { value: "ar_condicionado", label: "Ar Condicionado" },
        { value: "aquecedor", label: "Aquecedor" },
        { value: "lareira", label: "Lareira" },
        { value: "varanda", label: "Varanda/Sacada" },
        { value: "closet", label: "Closet" },
        { value: "escritorio", label: "Escritório" },
        { value: "lavabo", label: "Lavabo" },
        { value: "despensa", label: "Despensa" },
    ],
    estrutura: [
        { value: "elevador", label: "Elevador" },
        { value: "portaria_24h", label: "Portaria 24h" },
        { value: "interfone", label: "Interfone" },
        { value: "alarme", label: "Alarme" },
        { value: "cameras", label: "Câmeras de Segurança" },
        { value: "cerca_eletrica", label: "Cerca Elétrica" },
        { value: "portao_eletronico", label: "Portão Eletrônico" },
    ],
    externo: [
        { value: "jardim", label: "Jardim" },
        { value: "quintal", label: "Quintal" },
        { value: "pomar", label: "Pomar" },
        { value: "horta", label: "Horta" },
        { value: "area_servico", label: "Área de Serviço" },
        { value: "edicula", label: "Edícula" },
    ],
    mobilia: [
        { value: "mobiliado", label: "Mobiliado" },
        { value: "semi_mobiliado", label: "Semi-mobiliado" },
        { value: "armarios_embutidos", label: "Armários Embutidos" },
        { value: "cozinha_planejada", label: "Cozinha Planejada" },
    ],
    infraestrutura: [
        { value: "agua_encanada", label: "Água Encanada" },
        { value: "energia", label: "Energia Elétrica" },
        { value: "gas_encanado", label: "Gás Encanado" },
        { value: "esgoto", label: "Rede de Esgoto" },
        { value: "internet", label: "Internet/Fibra" },
        { value: "asfalto", label: "Rua Asfaltada" },
    ],
};

export default function FeaturesSection({ formData, onInputChange, setFormData, errors }) {
    const [novaComodidade, setNovaComodidade] = useState("");

    const comodidades = formData.comodidades || [];

    const toggleComodidade = (value) => {
        const novasComodidades = comodidades.includes(value)
            ? comodidades.filter((c) => c !== value)
            : [...comodidades, value];
        onInputChange("comodidades", novasComodidades);
    };

    const adicionarComodidadeCustomizada = () => {
        if (!novaComodidade.trim()) return;
        const value = novaComodidade.toLowerCase().replace(/\s+/g, "_");
        if (!comodidades.includes(value)) {
            onInputChange("comodidades", [...comodidades, value]);
        }
        setNovaComodidade("");
    };

    const removerComodidade = (value) => {
        onInputChange(
            "comodidades",
            comodidades.filter((c) => c !== value)
        );
    };

    // Verifica se uma comodidade é customizada (não está nas pré-definidas)
    const isCustomizada = (value) => {
        const todasPadrao = Object.values(COMODIDADES_PADRAO)
            .flat()
            .map((c) => c.value);
        return !todasPadrao.includes(value);
    };

    // Pega o label de uma comodidade
    const getLabel = (value) => {
        for (const categoria of Object.values(COMODIDADES_PADRAO)) {
            const found = categoria.find((c) => c.value === value);
            if (found) return found.label;
        }
        return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="space-y-6">
            {/* Áreas */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Square className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold">Áreas</Label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <Label>Área Total (m²)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.areaTotal || ""}
                            onChange={(e) =>
                                onInputChange("areaTotal", e.target.value)
                            }
                            placeholder="500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Área do terreno</p>
                    </div>
                    <div>
                        <Label>Área Construída (m²)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.areaConstruida || ""}
                            onChange={(e) =>
                                onInputChange("areaConstruida", e.target.value)
                            }
                            placeholder="180"
                        />
                    </div>
                    <div>
                        <Label>Área Útil (m²)</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.areaUtil || formData.area || ""}
                            onChange={(e) =>
                                onInputChange("areaUtil", e.target.value)
                            }
                            placeholder="150"
                        />
                    </div>
                    <div>
                        <Label>Ano de Construção</Label>
                        <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.anoConstrucao || ""}
                            onChange={(e) =>
                                onInputChange("anoConstrucao", e.target.value)
                            }
                            placeholder="2020"
                        />
                    </div>
                </div>
            </div>

            {/* Cômodos */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Home className="w-5 h-5 text-green-600" />
                    <Label className="text-lg font-semibold">Cômodos</Label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                        <Label className="flex items-center gap-1">
                            <Bed className="w-4 h-4" /> Quartos
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.quartos || ""}
                            onChange={(e) =>
                                onInputChange("quartos", e.target.value)
                            }
                            placeholder="3"
                        />
                    </div>
                    <div>
                        <Label className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-purple-500" /> Suítes
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.suites || ""}
                            onChange={(e) =>
                                onInputChange("suites", e.target.value)
                            }
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <Label className="flex items-center gap-1">
                            <Bath className="w-4 h-4" /> Banheiros
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.banheiros || ""}
                            onChange={(e) =>
                                onInputChange("banheiros", e.target.value)
                            }
                            placeholder="2"
                        />
                    </div>
                    <div>
                        <Label className="flex items-center gap-1">
                            <Car className="w-4 h-4" /> Vagas
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.vagas || ""}
                            onChange={(e) =>
                                onInputChange("vagas", e.target.value)
                            }
                            placeholder="2"
                        />
                    </div>
                    <div>
                        <Label>Vagas Cobertas</Label>
                        <Input
                            type="number"
                            min="0"
                            value={formData.vagasCobertas || ""}
                            onChange={(e) =>
                                onInputChange("vagasCobertas", e.target.value)
                            }
                            placeholder="1"
                        />
                    </div>
                    <div>
                        <Label>Andares</Label>
                        <Input
                            type="number"
                            min="1"
                            value={formData.andares || ""}
                            onChange={(e) =>
                                onInputChange("andares", e.target.value)
                            }
                            placeholder="2"
                        />
                    </div>
                </div>
            </div>

            {/* Comodidades */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <Label className="text-lg font-semibold">Comodidades</Label>
                    <span className="text-sm text-gray-500">
                        ({comodidades.length} selecionadas)
                    </span>
                </div>

                {/* Comodidades selecionadas */}
                {comodidades.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                        {comodidades.map((value) => (
                            <Badge
                                key={value}
                                variant={isCustomizada(value) ? "secondary" : "default"}
                                className="flex items-center gap-1 px-2 py-1"
                            >
                                {getLabel(value)}
                                <button
                                    type="button"
                                    onClick={() => removerComodidade(value)}
                                    className="ml-1 hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Adicionar comodidade customizada */}
                <div className="flex gap-2 mb-4">
                    <Input
                        value={novaComodidade}
                        onChange={(e) => setNovaComodidade(e.target.value)}
                        placeholder="Adicionar comodidade personalizada..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                adicionarComodidadeCustomizada();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={adicionarComodidadeCustomizada}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                    </Button>
                </div>

                {/* Grid de comodidades por categoria */}
                <div className="space-y-4">
                    {Object.entries(COMODIDADES_PADRAO).map(([categoria, items]) => (
                        <div key={categoria} className="p-3 bg-gray-50 rounded-lg">
                            <Label className="text-sm font-medium capitalize text-gray-600 mb-2 block">
                                {categoria.replace(/_/g, " ")}
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {items.map((item) => (
                                    <div
                                        key={item.value}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={item.value}
                                            checked={comodidades.includes(item.value)}
                                            onCheckedChange={() =>
                                                toggleComodidade(item.value)
                                            }
                                        />
                                        <Label
                                            htmlFor={item.value}
                                            className="text-sm cursor-pointer"
                                        >
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
