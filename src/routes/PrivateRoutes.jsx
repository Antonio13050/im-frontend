import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoutes = ({ children, allowedRoles }) => {
    const { user, role, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) return null;
    if (!user) {
        return <Navigate to="/login" state={{ path: location.pathname }} />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }
    return children;
};
