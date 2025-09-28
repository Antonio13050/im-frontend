import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const CorretoresSkeleton = () => {
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
                <div className="bg-white rounded-xl shadow-sm border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Array(8)
                                    .fill()
                                    .map((_, index) => (
                                        <TableHead
                                            key={index}
                                            className="h-12 bg-gray-200"
                                        ></TableHead>
                                    ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array(10)
                                .fill()
                                .map((_, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {Array(8)
                                            .fill()
                                            .map((_, colIndex) => (
                                                <TableCell
                                                    key={colIndex}
                                                    className="h-12 bg-gray-200"
                                                ></TableCell>
                                            ))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between items-center p-4 border-t">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-40 bg-gray-200" />
                            <Skeleton className="h-10 w-20 bg-gray-200" />
                            <Skeleton className="h-4 w-24 bg-gray-200" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-10 w-20 bg-gray-200" />
                            <Skeleton className="h-4 w-24 bg-gray-200" />
                            <Skeleton className="h-10 w-20 bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
