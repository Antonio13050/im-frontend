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

export const UserFilters = ({
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
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Atualização imediata
                        className="pl-10"
                    />
                </div>

                {currentUser?.perfil === "ADMIN" && (
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <Select
                            value={perfilFilter}
                            onValueChange={setPerfilFilter}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">
                                    Todos os Perfis
                                </SelectItem>
                                <SelectItem value="GERENTE">
                                    Apenas Gerentes
                                </SelectItem>
                                <SelectItem value="CORRETOR">
                                    Apenas Corretores
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
};
