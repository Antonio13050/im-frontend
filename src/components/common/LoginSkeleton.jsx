import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoginSkeleton = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <Skeleton className="h-12 w-12 rounded-full mx-auto bg-gray-200" />
                    <Skeleton className="h-8 w-48 mx-auto mt-4 bg-gray-200" />
                    <Skeleton className="h-4 w-64 mx-auto mt-2 bg-gray-200" />
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Email Field */}
                    <div>
                        <Skeleton className="h-4 w-16 bg-gray-200 mb-2" />
                        <Skeleton className="h-12 w-full bg-gray-200 rounded-lg" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <Skeleton className="h-4 w-16 bg-gray-200 mb-2" />
                        <Skeleton className="h-12 w-full bg-gray-200 rounded-lg" />
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded bg-gray-200" />
                            <Skeleton className="h-4 w-24 bg-gray-200" />
                        </div>
                        <Skeleton className="h-4 w-28 bg-gray-200" />
                    </div>

                    {/* Submit Button */}
                    <Skeleton className="h-12 w-full bg-gray-200 rounded-lg" />
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <Skeleton className="h-4 w-48 mx-auto bg-gray-200" />
                </div>
            </div>
        </div>
    );
};

export default LoginSkeleton;
