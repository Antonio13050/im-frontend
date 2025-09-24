import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ClientesSearch({ searchTerm, onSearchChange }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                    aria-label="Buscar clientes"
                />
            </div>
        </div>
    );
}
