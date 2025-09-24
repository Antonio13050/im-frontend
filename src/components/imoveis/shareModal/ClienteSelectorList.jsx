import React, { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone } from "lucide-react";

export default function ClienteSelectorList({
    clientes,
    searchTerm,
    selectedClientes,
    onSelectCliente,
}) {
    const filteredClientes = useMemo(
        () =>
            clientes.filter(
                (c) =>
                    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [clientes, searchTerm]
    );

    return (
        <ScrollArea className="h-64 border rounded-md">
            <div className="p-4 space-y-2">
                {filteredClientes.length > 0 ? (
                    filteredClientes.map((cliente) => (
                        <div
                            key={cliente.id}
                            onClick={() => onSelectCliente(cliente.id)}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                            <Checkbox
                                checked={selectedClientes.includes(cliente.id)}
                                onCheckedChange={() =>
                                    onSelectCliente(cliente.id)
                                }
                            />
                            <div className="flex-1">
                                <p className="font-medium flex items-center gap-2">
                                    <User className="w-3 h-3" /> {cliente.nome}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Phone className="w-3 h-3" />{" "}
                                    {cliente.telefone || "Sem telefone"}
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
    );
}
