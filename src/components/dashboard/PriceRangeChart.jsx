import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function PriceRangeChart({ imoveis }) {
    const getRangeData = () => {
        const ranges = [
            { name: "Até 200k", min: 0, max: 200000 },
            { name: "200k-500k", min: 200000, max: 500000 },
            { name: "500k-1M", min: 500000, max: 1000000 },
            { name: "Acima 1M", min: 1000000, max: Infinity },
        ];

        return ranges.map((range) => ({
            ...range,
            count: imoveis.filter(
                (i) =>
                    i.preco >= range.min &&
                    i.preco < range.max &&
                    i.status === "disponivel"
            ).length,
        }));
    };

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                    Faixa de Preço
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getRangeData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis fontSize={12} />
                            <Tooltip
                                formatter={(value) => [
                                    `${value} imóveis`,
                                    "Quantidade",
                                ]}
                            />
                            <Bar dataKey="count" fill="#3B82F6" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
