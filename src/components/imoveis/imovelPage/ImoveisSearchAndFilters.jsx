import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ImovelFilters from "./ImovelFilters";

export default function ImoveisSearchAndFilters({
    searchTerm,
    onSearchChange,
    filters,
    onFiltersChange,
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar imóveis..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                        aria-label="Buscar imóveis"
                    />
                </div>
            </div>
            <ImovelFilters
                filters={filters}
                onFiltersChange={onFiltersChange}
            />
        </div>
    );
}
