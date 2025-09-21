import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

export default function StatusChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                    Status dos Imóveis
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [
                                    `${value} imóveis`,
                                    "Quantidade",
                                ]}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-2"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {item.value} imóveis
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
