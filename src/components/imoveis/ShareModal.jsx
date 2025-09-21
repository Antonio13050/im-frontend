import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, User, Phone, Search } from "lucide-react";
import { toast } from "sonner";

export default function ShareModal({ open, onClose, imovel, clientes }) {
    const [selectedClientes, setSelectedClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSelectCliente = (clienteId) => {
        setSelectedClientes((prev) =>
            prev.includes(clienteId)
                ? prev.filter((id) => id !== clienteId)
                : [...prev, clienteId]
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price);
    };

    const handleShare = () => {
        if (selectedClientes.length === 0) {
            toast.error("Nenhum cliente selecionado");
            return;
        }

        const propertyUrl = window.location.href;
        const formattedPrice = formatPrice(imovel.preco);
        const details = [
            imovel.area && `- Área: ${imovel.area}m²`,
            imovel.quartos && `- Quartos: ${imovel.quartos}`,
            imovel.banheiros && `- Banheiros: ${imovel.banheiros}`,
            imovel.vagas && `- Vagas: ${imovel.vagas}`,
        ]
            .filter(Boolean)
            .join("\n");

        const message = `
Olá! Encontrei um imóvel que pode te interessar.

*${imovel.titulo}*

*Preço:* ${formattedPrice} ${imovel.finalidade === "aluguel" ? "/mês" : ""}

*Detalhes:*
${details}

Veja mais fotos e informações no link:
${propertyUrl}

Fico à disposição!
    `.trim();

        selectedClientes.forEach((clienteId) => {
            const cliente = clientes.find((c) => c.id === clienteId);
            if (cliente && cliente.telefone) {
                const phone = cliente.telefone.replace(/\D/g, ""); // Remove non-numeric characters
                const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
                    message
                )}`;
                window.open(whatsappUrl, "_blank");
            }
        });

        onClose();
    };

    const filteredClientes = clientes.filter(
        (c) =>
            c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Compartilhar com Clientes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <ScrollArea className="h-64 border rounded-md">
                            <div className="p-4 space-y-2">
                                {filteredClientes.length > 0 ? (
                                    filteredClientes.map((cliente) => (
                                        <div
                                            key={cliente.id}
                                            onClick={() =>
                                                handleSelectCliente(cliente.id)
                                            }
                                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={selectedClientes.includes(
                                                    cliente.id
                                                )}
                                                onCheckedChange={() =>
                                                    handleSelectCliente(
                                                        cliente.id
                                                    )
                                                }
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium flex items-center gap-2">
                                                    <User className="w-3 h-3" />{" "}
                                                    {cliente.nome}
                                                </p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Phone className="w-3 h-3" />{" "}
                                                    {cliente.telefone ||
                                                        "Sem telefone"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-center text-gray-500 py-4">
                                        Nenhum cliente encontrado.
                                    </p>
                                )}
                            </div>
                        </ScrollArea>

                        <p className="text-xs text-center text-gray-500">
                            O WhatsApp será aberto em uma nova aba para cada
                            cliente selecionado.
                        </p>

                        <Button
                            onClick={handleShare}
                            className="w-full"
                            disabled={selectedClientes.length === 0}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Compartilhar ({selectedClientes.length})
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
