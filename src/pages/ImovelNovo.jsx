import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createImovel } from "@/services/ImovelService";
import ImovelForm from "@/components/imoveis/imovelForm/ImovelForm";
import useImoveisData from "@/hooks/useImoveisData";

export default function ImovelNovo() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { corretores, isLoading, reload } = useImoveisData(user);

    const handleSave = async (formDataToSend) => {
        try {
            await createImovel(formDataToSend);
            toast.success("Imóvel criado com sucesso!");
            navigate("/imoveis");
        } catch (error) {
            console.error("Erro ao salvar imóvel:", error);
        }
    };

    const handleCancel = () => navigate("/imoveis");

    return (
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
            {/* <div className="max-w-5xl mx-auto py-10"> */}
            <h1 className="text-2xl font-bold mb-4">Cadastrar Novo Imóvel</h1>
            <p className="text-sm text-muted-foreground mb-2">
                Preencha as informações do imóvel nas abas abaixo.
            </p>
            <ImovelForm
                imovel={null}
                onSave={handleSave}
                onCancel={handleCancel}
                currentUser={user}
                corretores={corretores}
            />
        </div>
    );
}
