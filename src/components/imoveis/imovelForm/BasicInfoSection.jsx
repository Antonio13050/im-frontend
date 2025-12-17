import React, { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Star, Lock, Building } from "lucide-react";
import { fetchClientes } from "@/services/ClienteService";

const TIPOS_IMOVEL = [
    { value: "casa", label: "Casa" },
    { value: "apartamento", label: "Apartamento" },
    { value: "terreno", label: "Terreno" },
    { value: "comercial", label: "Comercial" },
    { value: "galpao", label: "Galpão" },
    { value: "chacara", label: "Chácara" },
    { value: "sala", label: "Sala Comercial" },
    { value: "kitnet", label: "Kitnet/Studio" },
    { value: "cobertura", label: "Cobertura" },
    { value: "loft", label: "Loft" },
    { value: "flat", label: "Flat" },
    { value: "fazenda", label: "Fazenda/Sítio" },
];

const SUBTIPOS = {
    casa: [
        { value: "terrea", label: "Térrea" },
        { value: "sobrado", label: "Sobrado" },
        { value: "duplex", label: "Duplex" },
        { value: "triplex", label: "Triplex" },
        { value: "condominio", label: "Em Condomínio" },
        { value: "geminada", label: "Geminada" },
    ],
    apartamento: [
        { value: "padrao", label: "Padrão" },
        { value: "duplex", label: "Duplex" },
        { value: "triplex", label: "Triplex" },
        { value: "garden", label: "Garden" },
        { value: "cobertura", label: "Cobertura" },
    ],
    comercial: [
        { value: "loja", label: "Loja" },
        { value: "sala", label: "Sala" },
        { value: "andar", label: "Andar Corrido" },
        { value: "predio", label: "Prédio Comercial" },
    ],
};

const FINALIDADES = [
    { value: "venda", label: "Venda" },
    { value: "aluguel", label: "Aluguel" },
    { value: "venda_aluguel", label: "Venda e Aluguel" },
    { value: "temporada", label: "Temporada" },
];

const STATUS_IMOVEL = [
    { value: "disponivel", label: "Disponível", color: "text-green-600" },
    { value: "reservado", label: "Reservado", color: "text-yellow-600" },
    { value: "vendido", label: "Vendido", color: "text-blue-600" },
    { value: "alugado", label: "Alugado", color: "text-purple-600" },
    { value: "inativo", label: "Inativo", color: "text-gray-600" },
    { value: "em_analise", label: "Em Análise", color: "text-orange-600" },
];

export default function BasicInfoSection({
    formData,
    onInputChange,
    currentUser,
    corretores,
    status,
    clientes,
    setClientes,
    errors,
}) {
    useEffect(() => {
        const loadClientes = async () => {
            try {
                const clientesData = await fetchClientes();
                setClientes(clientesData ?? []);
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
            }
        };
        if (!clientes.length) loadClientes();
    }, [clientes, setClientes]);

    const subtiposDisponiveis = SUBTIPOS[formData.tipo] || [];

    return (
        <div className="space-y-6">
            {/* Código e Título */}
            <div>
                <Label className="text-lg font-semibold">Identificação</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    {/* Código */}
                    <div>
                        <Label>Código</Label>
                        <Input
                            value={formData.codigo || ""}
                            disabled
                            placeholder="Auto-gerado"
                            className="bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Gerado automaticamente
                        </p>
                    </div>

                    {/* Título */}
                    <div className="md:col-span-3">
                        <Label>Título do Anúncio *</Label>
                        <Input
                            value={formData.titulo}
                            onChange={(e) =>
                                onInputChange("titulo", e.target.value)
                            }
                            placeholder="Ex: Casa 3 quartos com piscina no Centro"
                        />
                        {errors?.["titulo"] && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.titulo}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tipo, Subtipo e Finalidade */}
            <div className="border-t pt-6">
                <Label className="text-lg font-semibold">Classificação</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <Label>Tipo de Imóvel *</Label>
                        <Select
                            value={formData.tipo}
                            onValueChange={(value) => {
                                onInputChange("tipo", value);
                                onInputChange("subtipo", ""); // Limpa subtipo ao mudar tipo
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPOS_IMOVEL.map((tipo) => (
                                    <SelectItem key={tipo.value} value={tipo.value}>
                                        {tipo.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors?.["tipo"] && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.tipo}
                            </p>
                        )}
                    </div>

                    {/* Subtipo (condicional) */}
                    {subtiposDisponiveis.length > 0 && (
                        <div>
                            <Label>Subtipo</Label>
                            <Select
                                value={formData.subtipo || ""}
                                onValueChange={(value) =>
                                    onInputChange("subtipo", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o subtipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subtiposDisponiveis.map((subtipo) => (
                                        <SelectItem
                                            key={subtipo.value}
                                            value={subtipo.value}
                                        >
                                            {subtipo.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div>
                        <Label>Finalidade *</Label>
                        <Select
                            value={formData.finalidade}
                            onValueChange={(value) =>
                                onInputChange("finalidade", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a finalidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {FINALIDADES.map((fin) => (
                                    <SelectItem key={fin.value} value={fin.value}>
                                        {fin.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors?.["finalidade"] && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.finalidade}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Status e Flags */}
            <div className="border-t pt-6">
                <Label className="text-lg font-semibold">Status e Destaques</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div>
                        <Label>Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                onInputChange("status", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_IMOVEL.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        <span className={s.color}>{s.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Checkboxes de Destaque e Exclusividade */}
                    <div className="flex items-end gap-6">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="destaque"
                                checked={formData.destaque || false}
                                onCheckedChange={(checked) =>
                                    onInputChange("destaque", checked)
                                }
                            />
                            <Label
                                htmlFor="destaque"
                                className="flex items-center gap-1 cursor-pointer"
                            >
                                <Star className="w-4 h-4 text-yellow-500" />
                                Destaque
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="exclusividade"
                                checked={formData.exclusividade || false}
                                onCheckedChange={(checked) =>
                                    onInputChange("exclusividade", checked)
                                }
                            />
                            <Label
                                htmlFor="exclusividade"
                                className="flex items-center gap-1 cursor-pointer"
                            >
                                <Lock className="w-4 h-4 text-blue-500" />
                                Exclusividade
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsáveis */}
            <div className="border-t pt-6">
                <Label className="text-lg font-semibold">Responsáveis</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Corretor */}
                    {(currentUser?.scope === "ADMIN" ||
                        currentUser?.scope === "GERENTE") && (
                            <div>
                                <Label className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> Corretor Responsável
                                </Label>
                                <Select
                                    value={formData.corretorId}
                                    onValueChange={(value) =>
                                        onInputChange("corretorId", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione um corretor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Nenhum</SelectItem>
                                        {corretores.map((c) => (
                                            <SelectItem
                                                key={c.userId}
                                                value={String(c.userId)}
                                            >
                                                {c.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                    {/* Proprietário */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <Building className="w-4 h-4" /> Proprietário
                        </Label>
                        <Select
                            value={formData.proprietarioId || ""}
                            onValueChange={(value) =>
                                onInputChange("proprietarioId", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o proprietário" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Nenhum</SelectItem>
                                {clientes.map((cliente) => (
                                    <SelectItem
                                        key={cliente.id}
                                        value={String(cliente.id)}
                                    >
                                        {cliente.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-blue-600 mt-1">
                            💡 Dono do imóvel (para controle de comissões)
                        </p>
                    </div>

                    {/* Inquilino (se alugado) */}
                    {(status === "alugado") && (
                        <div>
                            <Label className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Inquilino Atual
                            </Label>
                            <Select
                                value={formData.inquilinoId || ""}
                                onValueChange={(value) =>
                                    onInputChange("inquilinoId", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o inquilino" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhum</SelectItem>
                                    {clientes.map((cliente) => (
                                        <SelectItem
                                            key={cliente.id}
                                            value={String(cliente.id)}
                                        >
                                            {cliente.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Comprador (se vendido) */}
                    {(status === "vendido") && (
                        <div>
                            <Label className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Comprador
                            </Label>
                            <Select
                                value={formData.clienteId || ""}
                                onValueChange={(value) =>
                                    onInputChange("clienteId", value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o comprador" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhum</SelectItem>
                                    {clientes.map((cliente) => (
                                        <SelectItem
                                            key={cliente.id}
                                            value={String(cliente.id)}
                                        >
                                            {cliente.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>

            {/* Descrição */}
            <div className="border-t pt-6">
                <Label className="text-lg font-semibold">Descrição</Label>
                <div className="mt-4">
                    <Textarea
                        value={formData.descricao}
                        onChange={(e) => onInputChange("descricao", e.target.value)}
                        placeholder="Descreva as características do imóvel, diferenciais, infraestrutura do bairro..."
                        rows={5}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {(formData.descricao || "").length} caracteres
                    </p>
                </div>
            </div>
        </div>
    );
}
