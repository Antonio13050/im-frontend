import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const CorretorCardSkeleton = () => {
    return (
        <Card className="overflow-hidden animate-pulse">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="flex gap-2">
                                <div className="h-5 bg-gray-200 rounded w-16"></div>
                                <div className="h-5 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="pt-3 border-t flex justify-between">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
            </CardContent>
        </Card>
    );
};
