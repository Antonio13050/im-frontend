import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const MapaSkeleton = () => {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Skeleton className="h-9 w-48 bg-gray-200" />
                    <Skeleton className="h-5 w-80 bg-gray-200 mt-2" />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded bg-gray-200" />
                            <Skeleton className="h-4 w-14 bg-gray-200" />
                        </div>
                        <Skeleton className="h-10 w-32 rounded bg-gray-200" />
                        <Skeleton className="h-10 w-32 rounded bg-gray-200" />
                        <Skeleton className="h-10 w-32 rounded bg-gray-200" />
                    </div>
                </div>

                {/* Map Container */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="relative h-[600px] bg-gray-100">
                        {/* Map Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <Skeleton className="h-16 w-16 rounded-full mx-auto bg-gray-200" />
                                <Skeleton className="h-4 w-32 mx-auto mt-4 bg-gray-200" />
                            </div>
                        </div>

                        {/* Stats Overlay Skeleton */}
                        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-4 w-4 rounded bg-gray-200" />
                                <Skeleton className="h-5 w-36 bg-gray-200" />
                            </div>
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24 bg-gray-200" />
                                <Skeleton className="h-4 w-20 bg-gray-200" />
                                <Skeleton className="h-4 w-28 bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapaSkeleton;
