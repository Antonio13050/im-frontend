import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchImovelById, updateImovel } from "@/services/ImovelService";
import ImovelForm from "@/components/imoveis/imovelForm/ImovelForm";
import useImoveisData from "@/hooks/useImoveisData";

export default function ImovelEditar() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [imovel, setImovel] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { corretores, isLoading, reload } = useImoveisData(user);

    useEffect(() => {
        const loadImovel = async () => {
            try {
                const data = await fetchImovelById(id);
                setImovel(data);
            } catch (error) {
                toast.error("Erro ao carregar imóvel");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadImovel();
    }, [id]);

    const handleSave = async (formDataToSend) => {
        try {
            await updateImovel(formDataToSend, id);
            toast.success("Imóvel atualizado com sucesso!");
            navigate("/imoveis");
        } catch (error) {
            console.error("Erro ao atualizar imóvel:", error);
            toast.error("Erro ao salvar alterações");
        }
    };
    const handleCancel = () => navigate("/imoveis");

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-600">Carregando...</div>
        );
    }

    if (!imovel) {
        return (
            <div className="p-10 text-center text-red-500">
                Imóvel não encontrado
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
            <h1 className="text-2xl font-bold mb-4">Editar Imóvel</h1>
            <ImovelForm
                imovel={imovel}
                onSave={handleSave}
                onCancel={handleCancel}
                currentUser={user}
                corretores={corretores}
            />
        </div>
    );
}
