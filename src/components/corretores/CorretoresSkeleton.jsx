import React from "react";

export const CorretoresSkeleton = () => {
    return (
        <div className="p-6 md:p-8">
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>{" "}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="h-10 bg-gray-200 rounded"></div>{" "}
                        <div className="h-10 bg-gray-200 rounded"></div>{" "}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-48 bg-gray-200 rounded-lg"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
