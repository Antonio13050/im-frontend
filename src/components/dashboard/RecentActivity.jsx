import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Home, Users, Clock } from "lucide-react";

export default function RecentActivity({ imoveis, clientes }) {
    const getRecentItems = () => {
        const recentImoveis = imoveis
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 3)
            .map((item) => ({
                ...item,
                type: "imovel",
                icon: Home,
            }));

        const recentClientes = clientes
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 3)
            .map((item) => ({
                ...item,
                type: "cliente",
                icon: Users,
            }));

        return [...recentImoveis, ...recentClientes]
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            .slice(0, 6);
    };

    const getStatusBadge = (item) => {
        if (item.type === "imovel") {
            const colors = {
                disponivel: "bg-green-100 text-green-800",
                vendido: "bg-blue-100 text-blue-800",
                alugado: "bg-yellow-100 text-yellow-800",
                reservado: "bg-red-100 text-red-800",
            };
            return (
                <Badge
                    className={
                        colors[item.status] || "bg-gray-100 text-gray-800"
                    }
                >
                    {item.status}
                </Badge>
            );
        }
        return <Badge className="bg-purple-100 text-purple-800">Cliente</Badge>;
    };
    const recentItems = getRecentItems();
    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                    Atividade Recente
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentItems.length > 0 ? (
                        recentItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="p-2 rounded-full bg-gray-100">
                                    <item.icon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                        {item.type === "imovel"
                                            ? item.titulo
                                            : item.nome}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                            {format(
                                                new Date(item.createdDate),
                                                "dd MMM yyyy",
                                                { locale: ptBR }
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(item)}
                                    {item.type === "imovel" && item.preco && (
                                        <span className="text-sm font-semibold text-gray-900">
                                            R${" "}
                                            {item.preco.toLocaleString("pt-BR")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>Nenhuma atividade recente</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
