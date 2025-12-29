import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const VisitasSkeleton = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <Skeleton className="h-9 w-56 bg-gray-200" />
                            <Skeleton className="h-5 w-72 bg-gray-200 mt-2" />
                        </div>
                        <Skeleton className="h-10 w-32 bg-gray-200" />
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {Array(4)
                        .fill()
                        .map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-5 shadow-sm border"
                            >
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-8 h-8 rounded-full bg-gray-200" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-24 bg-gray-200" />
                                        <Skeleton className="h-7 w-12 bg-gray-200 mt-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Filters Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border mb-6">
                    <div className="p-4 border-b">
                        <Skeleton className="h-6 w-20 bg-gray-200" />
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full bg-gray-200" />
                            <Skeleton className="h-10 w-full bg-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                {Array(7)
                                    .fill()
                                    .map((_, index) => (
                                        <th key={index} className="px-4 py-3 text-left">
                                            <Skeleton className="h-4 w-20 bg-gray-200" />
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array(8)
                                .fill()
                                .map((_, rowIndex) => (
                                    <tr key={rowIndex} className="border-b last:border-b-0">
                                        {Array(7)
                                            .fill()
                                            .map((_, colIndex) => (
                                                <td key={colIndex} className="px-4 py-4">
                                                    <Skeleton className="h-4 w-full bg-gray-200" />
                                                </td>
                                            ))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VisitasSkeleton;
