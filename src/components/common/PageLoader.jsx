import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * PageLoader - Componente de fallback para Suspense durante lazy loading
 * Exibe um skeleton de página genérico enquanto a página é carregada
 */
export const PageLoader = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Skeleton className="h-9 w-64 bg-gray-200" />
                        <Skeleton className="h-5 w-80 bg-gray-200 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-32 bg-gray-200" />
                </div>

                {/* Content Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48 bg-gray-200" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-24 bg-gray-200 rounded-lg" />
                            <Skeleton className="h-24 bg-gray-200 rounded-lg" />
                            <Skeleton className="h-24 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="p-4 border-b">
                        <Skeleton className="h-6 w-32 bg-gray-200" />
                    </div>
                    <div className="p-4 space-y-3">
                        {Array(5)
                            .fill()
                            .map((_, index) => (
                                <Skeleton key={index} className="h-12 w-full bg-gray-200" />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
