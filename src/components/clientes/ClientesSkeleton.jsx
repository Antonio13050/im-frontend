import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ClientesSkeleton = () => {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Skeleton className="h-8 w-48 md:w-64 bg-gray-200" />
                        <Skeleton className="h-4 w-64 md:w-96 bg-gray-200 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-32 bg-gray-200" />
                </div>

                {/* Filters Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Skeleton className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-200" />
                            <Skeleton className="h-10 w-full pl-10 bg-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 bg-gray-200" />
                            <Skeleton className="h-10 w-48 bg-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Results Count Skeleton */}
                <div className="mb-4">
                    <Skeleton className="h-4 w-40 bg-gray-200" />
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                {Array(6)
                                    .fill()
                                    .map((_, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-3 text-left"
                                        >
                                            <Skeleton className="h-4 w-20 bg-gray-200" />
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array(10)
                                .fill()
                                .map((_, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="border-b last:border-b-0"
                                    >
                                        {Array(6)
                                            .fill()
                                            .map((_, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    className="px-4 py-3"
                                                >
                                                    <Skeleton className="h-4 w-full bg-gray-200" />
                                                </td>
                                            ))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-4 flex items-center justify-between">
                    <Skeleton className="h-10 w-32 bg-gray-200" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-20 bg-gray-200" />
                        <Skeleton className="h-4 w-24 bg-gray-200" />
                        <Skeleton className="h-10 w-20 bg-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};
