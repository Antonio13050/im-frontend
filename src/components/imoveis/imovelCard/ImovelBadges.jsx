import React from "react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
    disponivel: "bg-green-100 text-green-800",
    vendido: "bg-blue-100 text-blue-800",
    alugado: "bg-yellow-100 text-yellow-800",
    reservado: "bg-red-100 text-red-800",
};

const tipoLabels = {
    casa: "Casa",
    apartamento: "Apartamento",
    terreno: "Terreno",
    comercial: "Comercial",
    galpao: "Galpão",
    chacara: "Chácara",
};

export default function ImovelBadges({ imovel }) {
    return (
        <div className="absolute top-3 left-3 flex gap-2">
            <Badge
                className={
                    statusColors[imovel.status] || "bg-gray-100 text-gray-800"
                }
            >
                {imovel.status}
            </Badge>
            <Badge variant="outline" className="bg-white">
                {tipoLabels[imovel.tipo] || imovel.tipo}
            </Badge>
        </div>
    );
}
