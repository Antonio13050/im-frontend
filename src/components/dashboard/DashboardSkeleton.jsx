import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-8 w-48 md:w-64 bg-gray-200" />
            <Skeleton className="h-4 w-64 md:w-96 bg-gray-200 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-10 w-full bg-gray-200" />
        <Skeleton className="h-10 w-full bg-gray-200 mt-4" />
        <Skeleton className="h-10 w-full bg-gray-200 mt-4" />
      </div>
    </div>
  );
};
