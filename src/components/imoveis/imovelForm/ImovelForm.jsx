import React, { useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BasicInfoSection from "./BasicInfoSection";
import AddressSection from "./AddressSection";
import FeaturesSection from "./FeaturesSection";
import PhotosSection from "./PhotosSection";

export default function ImovelForm({
    imovel,
    onSave,
    onCancel,
    currentUser,
    corretores,
}) {
    const [formData, setFormData] = useState({
        id: imovel?.id || "",
        titulo: imovel?.titulo || "",
        descricao: imovel?.descricao || "",
        tipo: imovel?.tipo || "casa",
        finalidade: imovel?.finalidade || "venda",
        endereco: {
            rua: imovel?.endereco?.rua || "",
            numero: imovel?.endereco?.numero || "",
            bairro: imovel?.endereco?.bairro || "",
            cidade: imovel?.endereco?.cidade || "",
            estado: imovel?.endereco?.estado || "",
            cep: imovel?.endereco?.cep || "",
            latitude: imovel?.endereco?.latitude || "",
            longitude: imovel?.endereco?.longitude || "",
        },
        preco: imovel?.preco || "",
        area: imovel?.area || "",
        quartos: imovel?.quartos || "",
        banheiros: imovel?.banheiros || "",
        vagas: imovel?.vagas || "",
        status: imovel?.status || "disponivel",
        fotos:
            imovel?.fotos?.map((foto) => ({
                id: foto.id,
                nomeArquivo: foto.nomeArquivo,
                dados: `data:${foto.tipoConteudo};base64,${foto.base64}`,
                tipoConteudo: foto.tipoConteudo,
                file: null,
            })) || [],
        clienteId: imovel?.clienteId ? String(imovel.clienteId) : "",
        corretorId: imovel?.corretorId
            ? String(imovel.corretorId)
            : String(currentUser?.sub),
    });

    const [clientes, setClientes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [isBuscandoCep, setIsBuscandoCep] = useState(false);

    const handleInputChange = useCallback((field, value) => {
        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.endereco.latitude || !formData.endereco.longitude) {
            toast.error(
                'As coordenadas (latitude e longitude) são obrigatórias para que o imóvel apareça no mapa. Use o botão "Buscar Coordenadas".'
            );
            return;
        }

        setIsSubmitting(true);

        const dataToSubmit = {
            ...formData,
            preco: parseFloat(formData.preco) || 0,
            area: parseFloat(formData.area) || null,
            quartos: parseInt(formData.quartos) || null,
            banheiros: parseInt(formData.banheiros) || null,
            vagas: parseInt(formData.vagas) || null,
            clienteId: formData.clienteId === "" ? null : formData.clienteId,
            corretorId: formData.corretorId === "" ? null : formData.corretorId,
            endereco: {
                ...formData.endereco,
                latitude: parseFloat(formData.endereco.latitude),
                longitude: parseFloat(formData.endereco.longitude),
            },
            fotos: formData.fotos.map((foto) => ({
                id: foto.id,
                nomeArquivo: foto.nomeArquivo,
                tipoConteudo: foto.tipoConteudo,
            })),
        };

        const formDataToSend = new FormData();
        formDataToSend.append(
            "imovel",
            new Blob([JSON.stringify(dataToSubmit)], {
                type: "application/json",
            })
        );

        formData.fotos.forEach((foto) => {
            if (foto.file) {
                formDataToSend.append("fotos", foto.file);
            }
        });

        try {
            await onSave(formDataToSend);
        } catch (error) {
            console.error("Erro ao salvar imóvel:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {imovel ? "Editar Imóvel" : "Novo Imóvel"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <BasicInfoSection
                        formData={formData}
                        onInputChange={handleInputChange}
                        currentUser={currentUser}
                        corretores={corretores}
                        status={formData.status}
                        clientes={clientes}
                        setClientes={setClientes}
                    />

                    <AddressSection
                        formData={formData}
                        onInputChange={handleInputChange}
                        isGeocoding={isGeocoding}
                        setIsGeocoding={setIsGeocoding}
                        isBuscandoCep={isBuscandoCep}
                        setIsBuscandoCep={setIsBuscandoCep}
                    />

                    <FeaturesSection
                        formData={formData}
                        onInputChange={handleInputChange}
                    />

                    <PhotosSection
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <div className="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar Imóvel"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
