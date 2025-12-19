import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createCliente } from "@/services/ClienteService";
import ClienteForm from "@/components/clientes/clienteForm/ClienteForm";

export default function ClienteNovo() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSave = async (formDataToSend) => {
        try {
            await createCliente(formDataToSend);
            toast.success("Cliente criado com sucesso!");
            navigate("/clientes");
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
            toast.error(
                error.response?.data?.message ||
                    "Erro ao salvar cliente. Tente novamente."
            );
        }
    };

    const handleCancel = () => navigate("/clientes");

    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
            <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Cliente</h1>
            <p className="text-sm text-muted-foreground mb-2">
                Preencha as informações do cliente nas abas abaixo.
            </p>
            <ClienteForm
                cliente={null}
                onSave={handleSave}
                onCancel={handleCancel}
                currentUser={user}
            />
        </div>
    );
}
