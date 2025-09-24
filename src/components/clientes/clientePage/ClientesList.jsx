import React from "react";
import ClienteCard from "../clienteCard/ClienteCard";
import { Users as UsersIcon, Search } from "lucide-react";

export default function ClientesList({
    filteredClientes,
    onEdit,
    onDelete,
    canEdit,
    clientImoveisMap,
}) {
    if (filteredClientes.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum cliente encontrado
                </h3>
                <p className="text-gray-500">
                    Tente ajustar a busca ou adicione um novo cliente
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClientes.map((cliente) => (
                <ClienteCard
                    key={cliente.id}
                    cliente={cliente}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canEdit={canEdit(cliente)}
                    imoveisVinculados={clientImoveisMap[cliente.id] || []}
                />
            ))}
        </div>
    );
}
