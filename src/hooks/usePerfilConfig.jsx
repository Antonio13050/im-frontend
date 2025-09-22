import { useMemo } from "react";
import { Shield, Users, User } from "lucide-react";

export const usePerfilConfig = (perfil) => {
    return useMemo(() => {
        switch (perfil) {
            case "ADMIN":
                return {
                    icon: <Shield className="w-4 h-4 text-red-600" />,
                    color: "bg-red-100 text-red-800",
                    label: "Administrador",
                };
            case "GERENTE":
                return {
                    icon: <Users className="w-4 h-4 text-blue-600" />,
                    color: "bg-blue-100 text-blue-800",
                    label: "Gerente",
                };
            default:
                return {
                    icon: <User className="w-4 h-4 text-gray-600" />,
                    color: "bg-gray-100 text-gray-800",
                    label: "Corretor",
                };
        }
    }, [perfil]);
};
