import React, { useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { clienteSchema } from "@/schemas/clienteSchema";

import PersonalDataSection from "./PersonalDataSection";
import AddressSection from "./AddressSection";
import DocumentsSection from "./DocumentsSection";
import FinancialSection from "./FinancialSection";
import PreferencesSection from "./PreferencesSection";
import ObservationsSection from "./ObservationsSection";

export default function ClienteForm({
  cliente,
  onSave,
  onCancel,
  currentUser,
}) {
  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: cliente?.id || "",
    nome: cliente?.nome || "",
    email: cliente?.email || "",
    telefone: cliente?.telefone || "",
    telefoneAlternativo: cliente?.telefoneAlternativo || "",
    emailAlternativo: cliente?.emailAlternativo || "",
    cpfCnpj: cliente?.cpfCnpj || "",
    dataNascimento: cliente?.dataNascimento || "",
    estadoCivil: cliente?.estadoCivil || "",
    profissao: cliente?.profissao || "",
    perfil: cliente?.perfil || "CLIENTE",
    corretorId: cliente?.corretorId
      ? String(cliente.corretorId)
      : String(currentUser?.sub || ""),

    endereco: cliente?.endereco
      ? {
          ...cliente.endereco,
          andar: cliente.endereco.andar ?? "",
          latitude: cliente.endereco.latitude ?? "",
          longitude: cliente.endereco.longitude ?? "",
        }
      : {
          rua: "",
          numero: "",
          complemento: "",
          andar: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          latitude: "",
          longitude: "",
        },

    documentos:
      cliente?.documentos?.map((doc) => ({
        id: doc.id,
        nomeArquivo: doc.nomeArquivo,
        tipoDocumento: doc.tipoDocumento,
        dados: doc.base64
          ? `data:${doc.tipoConteudo};base64,${doc.base64}`
          : null,
        tipoConteudo: doc.tipoConteudo,
        tamanho: doc.tamanho,
        file: null,
      })) || [],

    rendaMensal: cliente?.rendaMensal || "",
    banco: cliente?.banco || "",
    agencia: cliente?.agencia || "",
    conta: cliente?.conta || "",
    scoreCredito: cliente?.scoreCredito || "",
    restricoesFinanceiras: cliente?.restricoesFinanceiras || false,
    observacoesFinanceiras: cliente?.observacoesFinanceiras || "",

    interesses: cliente?.interesses
      ? {
          ...cliente.interesses,
          faixaPrecoMin: cliente.interesses.faixaPrecoMin ?? "",
          faixaPrecoMax: cliente.interesses.faixaPrecoMax ?? "",
          quartos: cliente.interesses.quartos ?? "",
          banheiros: cliente.interesses.banheiros ?? "",
          vagas: cliente.interesses.vagas ?? "",
          tiposImovel: cliente.interesses.tiposImovel || [],
          bairrosInteresse: cliente.interesses.bairrosInteresse || [],
          finalidade: cliente.interesses.finalidade || "venda",
          observacoesPreferencias:
            cliente.interesses.observacoesPreferencias || "",
        }
      : {
          tiposImovel: [],
          faixaPrecoMin: "",
          faixaPrecoMax: "",
          bairrosInteresse: [],
          finalidade: "venda",
          quartos: "",
          banheiros: "",
          vagas: "",
          observacoesPreferencias: "",
        },

    observacoes: cliente?.observacoes || "",
    observacoesInternas: cliente?.observacoesInternas || "",
  });

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

    const result = clienteSchema.safeParse(formData);
    if (!result.success) {
      setErrors(parseZodErrors(result.error));
      toast.error("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      // Financeiro
      rendaMensal:
        formData.rendaMensal !== "" &&
        formData.rendaMensal !== null &&
        formData.rendaMensal !== undefined
          ? parseFloat(formData.rendaMensal) || null
          : null,
      scoreCredito:
        formData.scoreCredito !== "" &&
        formData.scoreCredito !== null &&
        formData.scoreCredito !== undefined
          ? parseInt(formData.scoreCredito) || null
          : null,

      // Interesses
      interesses: {
        ...formData.interesses,
        faixaPrecoMin: parseFloat(formData.interesses.faixaPrecoMin) || null,
        faixaPrecoMax: parseFloat(formData.interesses.faixaPrecoMax) || null,
        quartos: parseInt(formData.interesses.quartos) || null,
        banheiros: parseInt(formData.interesses.banheiros) || null,
        vagas: parseInt(formData.interesses.vagas) || null,
      },

      // Endereço
      endereco: {
        ...formData.endereco,
        andar:
          formData.endereco?.andar !== "" &&
          formData.endereco?.andar !== null &&
          formData.endereco?.andar !== undefined
            ? parseInt(formData.endereco.andar) || null
            : null,
        latitude:
          formData.endereco?.latitude !== "" &&
          formData.endereco?.latitude !== null &&
          formData.endereco?.latitude !== undefined
            ? parseFloat(formData.endereco.latitude) || null
            : null,
        longitude:
          formData.endereco?.longitude !== "" &&
          formData.endereco?.longitude !== null &&
          formData.endereco?.longitude !== undefined
            ? parseFloat(formData.endereco.longitude) || null
            : null,
      },

      // Responsáveis
      corretorId:
        formData.corretorId === "" || formData.corretorId === "none"
          ? null
          : parseInt(formData.corretorId),

      // Documentos
      documentos: (formData.documentos || []).map((doc) => ({
        id: doc.id,
        nomeArquivo: doc.nomeArquivo,
        tipoDocumento: doc.tipoDocumento,
        tipoConteudo: doc.tipoConteudo,
      })),
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
      "cliente",
      new Blob([JSON.stringify(dataToSubmit)], {
        type: "application/json",
      })
    );

    // Documentos
    (formData.documentos || []).forEach((doc) => {
      if (doc.file) {
        formDataToSend.append("documentos", doc.file);
      }
    });

    try {
      await onSave(formDataToSend);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const showPreferences = ["CLIENTE", "LOCATARIO"].includes(formData.perfil);
  const isLocatario = formData.perfil === "LOCATARIO";

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-2 w-full">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          {showPreferences && (
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          )}
          <TabsTrigger value="observations">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardContent>
              <PersonalDataSection
                formData={formData}
                onInputChange={handleInputChange}
                currentUser={currentUser}
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

        <TabsContent value="documents">
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

        <TabsContent value="financial">
          <Card>
            <CardContent>
              <FinancialSection
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {showPreferences && (
          <TabsContent value="preferences">
            <Card>
              <CardContent>
                <PreferencesSection
                  formData={formData}
                  onInputChange={handleInputChange}
                  isLocatario={isLocatario}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="observations">
          <Card>
            <CardContent>
              <ObservationsSection
                formData={formData}
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
          {isSubmitting ? "Salvando..." : "Salvar Cliente"}
        </Button>
      </div>
    </form>
  );
}
