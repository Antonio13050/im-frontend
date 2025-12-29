import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ImobiliariaSkeleton = () => {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Skeleton className="h-9 w-56 bg-gray-200" />
                    <Skeleton className="h-5 w-72 bg-gray-200 mt-2" />
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg border p-6 space-y-6">
                    {/* Card Header */}
                    <div className="flex items-center gap-2 pb-4 border-b">
                        <Skeleton className="h-5 w-5 rounded bg-gray-200" />
                        <Skeleton className="h-6 w-40 bg-gray-200" />
                    </div>

                    {/* Logo Section */}
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-36 bg-gray-200" />
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-lg bg-gray-200" />
                            <Skeleton className="h-10 w-36 bg-gray-200" />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array(6)
                            .fill()
                            .map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-24 bg-gray-200 mb-2" />
                                    <Skeleton className="h-10 w-full bg-gray-200" />
                                </div>
                            ))}
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-5 w-24 bg-gray-200" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array(6)
                                .fill()
                                .map((_, i) => (
                                    <div key={i}>
                                        <Skeleton className="h-4 w-20 bg-gray-200 mb-2" />
                                        <Skeleton className="h-10 w-full bg-gray-200" />
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Skeleton className="h-4 w-24 bg-gray-200 mb-2" />
                        <Skeleton className="h-24 w-full bg-gray-200" />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Skeleton className="h-10 w-32 bg-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImobiliariaSkeleton;
