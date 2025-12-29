import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ImovelDetalhesSkeleton = () => {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Skeleton className="h-10 w-24 bg-gray-200 mb-4" />

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <Skeleton className="h-9 w-80 bg-gray-200" />
                            <Skeleton className="h-5 w-64 bg-gray-200 mt-2" />
                        </div>
                        <div className="text-right">
                            <Skeleton className="h-9 w-40 bg-gray-200" />
                            <div className="flex gap-2 mt-2 justify-end">
                                <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
                                <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <Skeleton className="h-96 w-full rounded-lg bg-gray-200" />
                            <div className="grid grid-cols-6 gap-2 mt-4">
                                {Array(6)
                                    .fill()
                                    .map((_, i) => (
                                        <Skeleton key={i} className="h-16 w-full rounded-lg bg-gray-200" />
                                    ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <Skeleton className="h-6 w-48 bg-gray-200 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full bg-gray-200" />
                                <Skeleton className="h-4 w-full bg-gray-200" />
                                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <Skeleton className="h-6 w-32 bg-gray-200 mb-4" />
                            <Skeleton className="h-10 w-full bg-gray-200" />
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <Skeleton className="h-6 w-24 bg-gray-200 mb-4" />
                            <div className="grid grid-cols-2 gap-4">
                                {Array(4)
                                    .fill()
                                    .map((_, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-lg bg-gray-200" />
                                            <div>
                                                <Skeleton className="h-3 w-12 bg-gray-200" />
                                                <Skeleton className="h-5 w-16 bg-gray-200 mt-1" />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Corretor */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <Skeleton className="h-6 w-40 bg-gray-200 mb-4" />
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-48 bg-gray-200" />
                                <Skeleton className="h-4 w-32 bg-gray-200" />
                                <Skeleton className="h-4 w-40 bg-gray-200" />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <Skeleton className="h-6 w-28 bg-gray-200 mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full bg-gray-200" />
                                <Skeleton className="h-4 w-3/4 bg-gray-200" />
                                <Skeleton className="h-4 w-1/2 bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImovelDetalhesSkeleton;
