import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const FormularioSkeleton = () => {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Skeleton className="h-10 w-24 bg-gray-200 mb-6" />

                {/* Title */}
                <div className="mb-8">
                    <Skeleton className="h-9 w-64 bg-gray-200" />
                    <Skeleton className="h-5 w-80 bg-gray-200 mt-2" />
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                    {/* Section 1 */}
                    <div>
                        <Skeleton className="h-6 w-40 bg-gray-200 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array(4)
                                .fill()
                                .map((_, i) => (
                                    <div key={i}>
                                        <Skeleton className="h-4 w-24 bg-gray-200 mb-2" />
                                        <Skeleton className="h-10 w-full bg-gray-200" />
                                    </div>
                                ))}
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Section 2 */}
                    <div>
                        <Skeleton className="h-6 w-32 bg-gray-200 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    <hr className="border-gray-200" />

                    {/* Section 3 - Textarea */}
                    <div>
                        <Skeleton className="h-6 w-28 bg-gray-200 mb-4" />
                        <Skeleton className="h-4 w-24 bg-gray-200 mb-2" />
                        <Skeleton className="h-24 w-full bg-gray-200" />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Skeleton className="h-10 w-24 bg-gray-200" />
                        <Skeleton className="h-10 w-28 bg-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormularioSkeleton;
