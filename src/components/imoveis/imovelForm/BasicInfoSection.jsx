// BasicInfoSection.jsx - Seção de info básica do form
import React from "react";
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
import { User } from "lucide-react";
import { fetchClientes } from "@/services/ClienteService";

export default function BasicInfoSection({
    formData,
    onInputChange,
    currentUser,
    corretores,
    status,
    clientes,
    setClientes,
}) {
    // Carregar clientes se necessário
    React.useEffect(() => {
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

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Título *</Label>
                    <Input
                        value={formData.titulo}
                        onChange={(e) =>
                            onInputChange("titulo", e.target.value)
                        }
                        placeholder="Ex: Casa 3 quartos no Centro"
                        required
                    />
                </div>

                <div>
                    <Label>Tipo *</Label>
                    <Select
                        value={formData.tipo}
                        onValueChange={(value) => onInputChange("tipo", value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="casa">Casa</SelectItem>
                            <SelectItem value="apartamento">
                                Apartamento
                            </SelectItem>
                            <SelectItem value="terreno">Terreno</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="galpao">Galpão</SelectItem>
                            <SelectItem value="chacara">Chácara</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Finalidade *</Label>
                    <Select
                        value={formData.finalidade}
                        onValueChange={(value) =>
                            onInputChange("finalidade", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="venda">Venda</SelectItem>
                            <SelectItem value="aluguel">Aluguel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) =>
                            onInputChange("status", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="disponivel">
                                Disponível
                            </SelectItem>
                            <SelectItem value="vendido">Vendido</SelectItem>
                            <SelectItem value="alugado">Alugado</SelectItem>
                            <SelectItem value="reservado">Reservado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {(currentUser.scope === "ADMIN" ||
                currentUser.scope === "GERENTE") && (
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
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um corretor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={null}>Nenhum</SelectItem>
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

            {(status === "vendido" || status === "alugado") && (
                <div>
                    <Label>Cliente Vinculado</Label>
                    <Select
                        value={formData.clienteId}
                        onValueChange={(value) =>
                            onInputChange("clienteId", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={null}>Nenhum</SelectItem>
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
                        💡 Vincule o cliente que comprou ou alugou este imóvel.
                    </p>
                </div>
            )}

            <div>
                <Label>Descrição</Label>
                <Textarea
                    value={formData.descricao}
                    onChange={(e) => onInputChange("descricao", e.target.value)}
                    placeholder="Descreva as características do imóvel..."
                    rows={3}
                />
            </div>
        </>
    );
}
