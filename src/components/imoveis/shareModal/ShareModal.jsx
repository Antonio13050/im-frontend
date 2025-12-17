import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Send } from "lucide-react";
import { toast } from "sonner";
import ClienteSelectorList from "./ClienteSelectorList";

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
        const formattedPrice = formatPrice(imovel.precoVenda || imovel.precoAluguel || imovel.precoTemporada || imovel.preco || 0);
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
                const phone = cliente.telefone.replace(/\D/g, "");
                const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
                    message
                )}`;
                window.open(whatsappUrl, "_blank");
            } else {
                toast.warning(`Cliente ${cliente.nome} sem telefone válido`);
            }
        });

        onClose();
    };

    return (
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

                    <ClienteSelectorList
                        clientes={clientes}
                        searchTerm={searchTerm}
                        selectedClientes={selectedClientes}
                        onSelectCliente={handleSelectCliente}
                    />

                    <p className="text-xs text-center text-gray-500">
                        O WhatsApp será aberto em uma nova aba para cada cliente
                        selecionado.
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
    );
}
