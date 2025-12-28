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
    <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
      <div className="max-w-[1800px] 2xl:max-w-none mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Skeleton className="h-8 w-64 bg-gray-200" />
            <Skeleton className="h-5 w-80 mt-2 bg-gray-200" />
          </div>
          <Skeleton className="h-10 w-36 bg-blue-200" />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Skeleton className="h-10 w-full md:w-1/3 bg-gray-200" />
            <div className="flex gap-2 w-full md:w-auto">
              <Skeleton className="h-10 w-24 bg-gray-200" />
              <Skeleton className="h-10 w-24 bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Found items count */}
        <div className="mb-4">
          <Skeleton className="h-5 w-48 bg-gray-200" />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {Array(8)
                  .fill()
                  .map((_, index) => (
                    <TableHead key={index}>
                      <Skeleton className="h-4 w-full bg-gray-200" />
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(10) // Render 10 skeleton rows
                .fill()
                .map((_, i) => (
                  <TableRow key={i}>
                    {Array(8) // 8 columns per row
                      .fill()
                      .map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full bg-gray-100" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-between items-center p-4 border-t mt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-48 bg-gray-200" />
            <Skeleton className="h-10 w-20 bg-gray-200" />
            <Skeleton className="h-5 w-20 bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 bg-gray-200" />
            <Skeleton className="h-5 w-24 bg-gray-200" />
            <Skeleton className="h-10 w-24 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
