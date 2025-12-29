import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const AgendaSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {Array(7)
                .fill()
                .map((_, dayIndex) => (
                    <div
                        key={dayIndex}
                        className="bg-white rounded-lg border p-3"
                    >
                        <Skeleton className="h-4 w-10 mx-auto bg-gray-200" />
                        <Skeleton className="h-8 w-8 mx-auto mt-1 bg-gray-200" />
                        <div className="space-y-2 mt-4">
                            {Array(Math.floor(Math.random() * 2) + 1)
                                .fill()
                                .map((_, visitIndex) => (
                                    <div
                                        key={visitIndex}
                                        className="bg-blue-50 p-2 rounded border-l-2 border-blue-400"
                                    >
                                        <Skeleton className="h-3 w-full bg-gray-200" />
                                        <Skeleton className="h-3 w-16 mt-1 bg-gray-200" />
                                        <Skeleton className="h-3 w-20 mt-1 bg-gray-200" />
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default AgendaSkeleton;
