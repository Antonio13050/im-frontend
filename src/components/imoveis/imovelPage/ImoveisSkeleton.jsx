import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ImoveisSkeleton = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1800px] 2xl:max-w-none mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32 bg-gray-200" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-24 bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <Skeleton className="h-10 w-full mb-4 bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <Skeleton className="h-48 w-full bg-gray-200" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-2/3 bg-gray-200" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-8 w-20 bg-gray-200" />
                    <Skeleton className="h-8 w-20 bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
