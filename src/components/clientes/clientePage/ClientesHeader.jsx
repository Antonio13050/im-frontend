import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ClientesHeader({ onNewCliente }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Clientes
                </h1>
                <p className="text-gray-600 mt-1">
                    Gerencie seus leads e clientes
                </p>
            </div>
            <Button
                onClick={onNewCliente}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Novo Cliente
            </Button>
        </div>
    );
}
