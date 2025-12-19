import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchClienteById, updateCliente } from "@/services/ClienteService";
import ClienteForm from "@/components/clientes/clienteForm/ClienteForm";

export default function ClienteEditar() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadCliente = async () => {
            try {
                const data = await fetchClienteById(id);
                setCliente(data);
            } catch (error) {
                toast.error("Erro ao carregar cliente");
                console.error(error);
                navigate("/clientes");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            loadCliente();
        }
    }, [id, navigate]);

    const handleSave = async (formDataToSend) => {
        try {
            await updateCliente(formDataToSend, id);
            toast.success("Cliente atualizado com sucesso!");
            navigate("/clientes");
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            toast.error(
                error.response?.data?.message ||
                    "Erro ao salvar alterações. Tente novamente."
            );
        }
    };

    const handleCancel = () => navigate("/clientes");

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-600">Carregando...</div>
        );
    }

    if (!cliente) {
        return (
            <div className="p-10 text-center text-red-500">
                Cliente não encontrado
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
            <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>
            <ClienteForm
                cliente={cliente}
                onSave={handleSave}
                onCancel={handleCancel}
                currentUser={user}
            />
        </div>
    );
}
