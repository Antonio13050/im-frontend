import React, { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import FinanceSection from "./FinanceSection";
import MediaSection from "./MediaSection";
import DocumentsSection from "./DocumentsSection";

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
        // Identificação
        id: imovel?.id || "",
        codigo: imovel?.codigo || "",
        titulo: imovel?.titulo || "",
        descricao: imovel?.descricao || "",

        // Classificação
        tipo: imovel?.tipo || "casa",
        subtipo: imovel?.subtipo || "",
        finalidade: imovel?.finalidade || "venda",
        status: imovel?.status || "disponivel",
        destaque: imovel?.destaque || false,
        exclusividade: imovel?.exclusividade || false,

        // Endereço
        endereco: {
            rua: imovel?.endereco?.rua || "",
            numero: imovel?.endereco?.numero || "",
            complemento: imovel?.endereco?.complemento || "",
            andar: imovel?.endereco?.andar || "",
            bairro: imovel?.endereco?.bairro || "",
            cidade: imovel?.endereco?.cidade || "",
            estado: imovel?.endereco?.estado || "",
            cep: imovel?.endereco?.cep || "",
            latitude: imovel?.endereco?.latitude || "",
            longitude: imovel?.endereco?.longitude || "",
        },

        // Áreas
        areaTotal: imovel?.areaTotal || "",
        areaConstruida: imovel?.areaConstruida || "",
        areaUtil: imovel?.areaUtil || imovel?.area || "",
        anoConstrucao: imovel?.anoConstrucao || "",

        // Cômodos
        quartos: imovel?.quartos || "",
        suites: imovel?.suites || "",
        banheiros: imovel?.banheiros || "",
        vagas: imovel?.vagas || "",
        vagasCobertas: imovel?.vagasCobertas || "",
        andares: imovel?.andares || "",

        // Comodidades
        comodidades: imovel?.comodidades || [],

        // Financeiro
        precoVenda: imovel?.precoVenda || imovel?.preco || "",
        precoAluguel: imovel?.precoAluguel || "",
        precoTemporada: imovel?.precoTemporada || "",
        valorCondominio: imovel?.valorCondominio || "",
        valorIptu: imovel?.valorIptu || "",
        valorEntrada: imovel?.valorEntrada || "",
        aceitaFinanciamento: imovel?.aceitaFinanciamento || false,
        aceitaFgts: imovel?.aceitaFgts || false,
        aceitaPermuta: imovel?.aceitaPermuta || false,
        posseImediata: imovel?.posseImediata ?? true,
        comissaoVenda: imovel?.comissaoVenda || "",
        comissaoAluguel: imovel?.comissaoAluguel || "",

        // Documentação
        situacaoDocumental: imovel?.situacaoDocumental || "nao_verificado",
        observacoesInternas: imovel?.observacoesInternas || "",

        // Mídia
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
        documentos:
            imovel?.documentos?.map((doc) => ({
                id: doc.id,
                nomeArquivo: doc.nomeArquivo,
                tipoDocumento: doc.tipoDocumento,
                dados: doc.base64 ? `data:${doc.tipoConteudo};base64,${doc.base64}` : null,
                tipoConteudo: doc.tipoConteudo,
                tamanho: doc.tamanho,
                file: null,
            })) || [],

        // Responsáveis
        proprietarioId: imovel?.proprietarioId ? String(imovel.proprietarioId) : "",
        inquilinoId: imovel?.inquilinoId ? String(imovel.inquilinoId) : "",
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
            // Áreas
            areaTotal: parseFloat(formData.areaTotal) || null,
            areaConstruida: parseFloat(formData.areaConstruida) || null,
            areaUtil: parseFloat(formData.areaUtil) || null,
            anoConstrucao: parseInt(formData.anoConstrucao) || null,

            // Cômodos
            quartos: parseInt(formData.quartos) || null,
            suites: parseInt(formData.suites) || null,
            banheiros: parseInt(formData.banheiros) || null,
            vagas: parseInt(formData.vagas) || null,
            vagasCobertas: parseInt(formData.vagasCobertas) || null,
            andares: parseInt(formData.andares) || null,

            // Financeiro
            precoVenda: parseFloat(formData.precoVenda) || null,
            precoAluguel: parseFloat(formData.precoAluguel) || null,
            precoTemporada: parseFloat(formData.precoTemporada) || null,
            valorCondominio: parseFloat(formData.valorCondominio) || null,
            valorIptu: parseFloat(formData.valorIptu) || null,
            valorEntrada: parseFloat(formData.valorEntrada) || null,
            comissaoVenda: parseFloat(formData.comissaoVenda) || null,
            comissaoAluguel: parseFloat(formData.comissaoAluguel) || null,

            // Responsáveis (tratar "none" como null)
            proprietarioId: (formData.proprietarioId === "" || formData.proprietarioId === "none") ? null : parseInt(formData.proprietarioId),
            inquilinoId: (formData.inquilinoId === "" || formData.inquilinoId === "none") ? null : parseInt(formData.inquilinoId),
            clienteId: (formData.clienteId === "" || formData.clienteId === "none") ? null : parseInt(formData.clienteId),
            corretorId: (formData.corretorId === "" || formData.corretorId === "none") ? null : parseInt(formData.corretorId),

            // Endereço
            endereco: {
                ...formData.endereco,
                andar: parseInt(formData.endereco.andar) || null,
                latitude: parseFloat(formData.endereco.latitude),
                longitude: parseFloat(formData.endereco.longitude),
            },

            // Mídia
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
            documentos: (formData.documentos || []).map((doc) => ({
                id: doc.id,
                nomeArquivo: doc.nomeArquivo,
                tipoDocumento: doc.tipoDocumento,
                tipoConteudo: doc.tipoConteudo,
            })),
        };

        const formDataToSend = new FormData();
        formDataToSend.append(
            "imovel",
            new Blob([JSON.stringify(dataToSubmit)], {
                type: "application/json",
            })
        );

        // Fotos
        formData.fotos.forEach((foto) => {
            if (foto.file) {
                formDataToSend.append("fotos", foto.file);
            }
        });

        // Vídeos
        (formData.videos || []).forEach((video) => {
            if (video.file) {
                formDataToSend.append("videos", video.file);
            }
        });

        // Documentos
        (formData.documentos || []).forEach((doc) => {
            if (doc.file) {
                formDataToSend.append("documentos", doc.file);
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
                <TabsList className="grid grid-cols-6 mb-2 w-full">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="address">Endereço</TabsTrigger>
                    <TabsTrigger value="features">Características</TabsTrigger>
                    <TabsTrigger value="finance">Financeiro</TabsTrigger>
                    <TabsTrigger value="media">Mídia</TabsTrigger>
                    <TabsTrigger value="docs">Documentos</TabsTrigger>
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
                                setFormData={setFormData}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="finance">
                    <Card>
                        <CardContent>
                            <FinanceSection
                                formData={formData}
                                onInputChange={handleInputChange}
                                errors={errors}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="media">
                    <Card>
                        <CardContent>
                            <MediaSection
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="docs">
                    <Card>
                        <CardContent>
                            <DocumentsSection
                                formData={formData}
                                setFormData={setFormData}
                                onInputChange={handleInputChange}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 mt-8 border-t pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Imóvel"}
                </Button>
            </div>
        </form>
    );
}
