import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ClienteDetalhesSkeleton = () => {
    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
            {/* Back Button */}
            <div className="mb-6">
                <Skeleton className="h-10 w-28 bg-gray-200" />
            </div>

            <div className="space-y-5">
                {/* Header with Name */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
                        <Skeleton className="h-8 w-64 bg-gray-200" />
                        <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Array(6)
                                .fill()
                                .map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-5 rounded-full bg-gray-200 flex-shrink-0" />
                                        <Skeleton className="h-4 w-48 bg-gray-200" />
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Interesses Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
                        <Skeleton className="h-6 w-28 bg-gray-200" />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-4 w-28 bg-gray-200" />
                            {Array(4)
                                .fill()
                                .map((_, i) => (
                                    <Skeleton key={i} className="h-6 w-20 rounded-full bg-gray-200" />
                                ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-4 w-20 bg-gray-200" />
                            {Array(3)
                                .fill()
                                .map((_, i) => (
                                    <Skeleton key={i} className="h-6 w-24 rounded-full bg-gray-200" />
                                ))}
                        </div>
                    </div>
                </section>

                {/* Corretor Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
                        <Skeleton className="h-6 w-44 bg-gray-200" />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <Skeleton className="h-4 w-40 bg-gray-200" />
                    </div>
                </section>

                {/* Imóveis Vinculados Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
                        <Skeleton className="h-6 w-48 bg-gray-200" />
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
                        {Array(3)
                            .fill()
                            .map((_, i) => (
                                <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <Skeleton className="h-5 w-48 bg-gray-200" />
                                        <Skeleton className="h-4 w-32 bg-gray-200 mt-1" />
                                    </div>
                                    <div className="text-right">
                                        <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
                                        <Skeleton className="h-6 w-28 bg-gray-200 mt-1" />
                                    </div>
                                </div>
                            ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ClienteDetalhesSkeleton;
