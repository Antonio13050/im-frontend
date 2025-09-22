import React from "react";
import { Users as UsersIcon } from "lucide-react";

const AccessDenied = ({
    title = "Acesso Negado",
    description = "Apenas administradores e gerentes podem acessar esta página",
    icon = <UsersIcon className="w-8 h-8 text-red-600" />,
    bgColor = "bg-red-100",
}) => {
    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center py-12">
                    <div
                        className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                        {icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
