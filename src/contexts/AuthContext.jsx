import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    user: null,
    isLoading: true,
    handleLogin: () => {},
    handleLogout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const decodedUser = jwtDecode(token);
                    // Check token expiration
                    const currentTime = Date.now() / 1000; // Convert to seconds
                    if (decodedUser.exp && decodedUser.exp < currentTime) {
                        console.warn("Token expirado");
                        handleLogout();
                        return;
                    }
                    // Ensure roles[0].nome is used instead of scope
                    if (!decodedUser.scope) {
                        console.error("Token não contém scope válido");
                        handleLogout();
                        return;
                    }
                    localStorage.setItem("userId", decodedUser.sub);
                    localStorage.setItem("userRole", decodedUser.scope);
                    setUser(decodedUser);
                } catch (error) {
                    console.error("Erro ao decodificar token:", error);
                    handleLogout();
                }
            }
            setIsLoading(false);
        };
        initializeAuth();
    }, []);

    const handleLogin = (token) => {
        if (!token || typeof token !== "string") {
            console.error("Token inválido:", token);
            throw new Error("Token deve ser uma string válida");
        }
        try {
            const decodedUser = jwtDecode(token);
            // Check token expiration
            const currentTime = Date.now() / 1000;
            if (decodedUser.exp && decodedUser.exp < currentTime) {
                throw new Error("Token expirado");
            }
            if (!decodedUser.scope) {
                throw new Error("Token não contém scope válido");
            }
            localStorage.setItem("userId", decodedUser.sub);
            localStorage.setItem("userRole", decodedUser.scope);
            localStorage.setItem("token", token);
            setUser(decodedUser);
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            throw new Error("Erro ao processar o token: " + error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        setUser(null);
        setIsLoading(false);
    };

    const role = user?.scope || localStorage.getItem("userRole") || null;
    return (
        <AuthContext.Provider
            value={{ user, role, isLoading, handleLogin, handleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
