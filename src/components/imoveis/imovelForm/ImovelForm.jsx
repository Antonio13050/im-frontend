import React, { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { z } from "zod";
import {
    basicInfoSchema,
    addressSchema,
    featuresSchema,
    imovelSchema,
} from "@/schemas/imovelSchema";

import BasicInfoSection from "./BasicInfoSection";
import AddressSection from "./AddressSection";
import FeaturesSection from "./FeaturesSection";
import MediaSection from "./MediaSection";

export default function ImovelForm({
    imovel,
    onSave,
    onCancel,
    currentUser,
    corretores,
}) {
    const [activeTab, setActiveTab] = useState("info");
    const [errors, setErrors] = useState({});
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
        videos:
            imovel?.videos?.map((video) => ({
                id: video.id,
                nomeArquivo: video.nomeArquivo,
                dados: `data:${video.tipoConteudo};base64,${video.base64}`,
                tipoConteudo: video.tipoConteudo,
                tamanho: video.tamanho,
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

    function parseZodErrors(error) {
        const result = {};
        error.issues.forEach((issue) => {
            result[issue.path.join(".")] = issue.message;
        });
        return result;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = imovelSchema.safeParse(formData);
        if (!result.success) {
            setErrors(parseZodErrors(result.error));
            toast.error("Preencha todos os campos obrigatórios corretamente.");
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
            videos: (formData.videos || []).map((video) => ({
                id: video.id,
                nomeArquivo: video.nomeArquivo,
                tipoConteudo: video.tipoConteudo,
                tamanho: video.tamanho,
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

        (formData.videos || []).forEach((video) => {
            if (video.file) {
                formDataToSend.append("videos", video.file);
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
        <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-2 w-full">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="address">Endereço</TabsTrigger>
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="photos">Mídia</TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card>
                        <CardContent>
                            <BasicInfoSection
                                formData={formData}
                                onInputChange={handleInputChange}
                                currentUser={currentUser}
                                corretores={corretores}
                                status={formData.status}
                                clientes={clientes}
                                setClientes={setClientes}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="address">
                    <Card>
                        <CardContent>
                            <AddressSection
                                formData={formData}
                                onInputChange={handleInputChange}
                                isGeocoding={isGeocoding}
                                setIsGeocoding={setIsGeocoding}
                                isBuscandoCep={isBuscandoCep}
                                setIsBuscandoCep={setIsBuscandoCep}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features">
                    <Card>
                        <CardContent>
                            <FeaturesSection
                                formData={formData}
                                onInputChange={handleInputChange}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="photos">
                    <Card>
                        <CardContent>
                            <MediaSection
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 mt-8 border-t pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit">Salvar Imóvel</Button>
            </div>
        </form>
    );
}
