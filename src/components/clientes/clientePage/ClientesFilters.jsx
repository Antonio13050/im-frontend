import React from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export const ClientesFilters = ({
    searchTerm,
    setSearchTerm,
    perfilFilter,
    setPerfilFilter,
    currentUser,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar clientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        aria-label="Buscar clientes"
                    />
                </div>

                {(currentUser?.perfil === "ADMIN" ||
                    currentUser?.perfil === "GERENTE") && (
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <Select
                            value={perfilFilter}
                            onValueChange={setPerfilFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">
                                    Todos os Perfis
                                </SelectItem>
                                <SelectItem value="CLIENTE">Cliente</SelectItem>
                                <SelectItem value="PROPRIETARIO">
                                    Proprietário
                                </SelectItem>
                                <SelectItem value="LOCATARIO">
                                    Locatário
                                </SelectItem>
                                <SelectItem value="FIADOR">Fiador</SelectItem>
                                <SelectItem value="CORRETOR_PARCEIRO">
                                    Corretor Parceiro
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
};
