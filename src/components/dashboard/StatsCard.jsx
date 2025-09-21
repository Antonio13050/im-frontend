import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({
    title,
    value,
    icon: Icon,
    gradient,
    subtitle,
}) {
    return (
        <Card className="relative overflow-hidden border-0 shadow-lg bg-white">
            <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`}
            />
            <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">
                            {title}
                        </p>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-sm text-gray-500 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}
                    >
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
