// src/components/LoginScreen.jsx
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { login } from "@/services/AuthService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectUrl = location.state?.path || "/";

    useEffect(() => {
        if (localStorage.getItem("userId")) {
            navigate("/", { replace: true });
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                const token = success.token;
                handleLogin(token);
                navigate(redirectUrl, { replace: true });
                toast.success("Login bem-sucedido!");
            } else {
                toast.error("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            toast.error(
                error.message ||
                    "Erro ao fazer login. Verifique suas credenciais."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            ImobiManager
                        </h1>
                    </div>
                    <h2 className="text-xl text-gray-700 mb-2">
                        Bem-vindo(a)!
                    </h2>
                    <p className="text-gray-500 mb-8">
                        Faça login para acessar o painel e gerenciar seus
                        imóveis e clientes.
                    </p>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@exemplo.com"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                            disabled={isLoading}
                        >
                            {isLoading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                </div>
                <p className="text-xs text-gray-400 mt-6">
                    Plataforma de gestão imobiliária.
                </p>
            </div>
        </div>
    );
}
