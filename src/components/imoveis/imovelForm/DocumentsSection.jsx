import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, X, Eye, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const TIPOS_DOCUMENTO = [
    { value: "matricula", label: "Matrícula do Imóvel" },
    { value: "escritura", label: "Escritura" },
    { value: "iptu", label: "Carnê de IPTU" },
    { value: "habite_se", label: "Habite-se" },
    { value: "planta", label: "Planta do Imóvel" },
    { value: "contrato", label: "Contrato" },
    { value: "procuracao", label: "Procuração" },
    { value: "certidao_negativa", label: "Certidão Negativa" },
    { value: "outros", label: "Outros" },
];

const SITUACOES_DOCUMENTAIS = [
    { value: "regular", label: "Regular", color: "bg-green-100 text-green-800" },
    { value: "em_regularizacao", label: "Em Regularização", color: "bg-yellow-100 text-yellow-800" },
    { value: "irregular", label: "Irregular", color: "bg-red-100 text-red-800" },
    { value: "nao_verificado", label: "Não Verificado", color: "bg-gray-100 text-gray-800" },
];

export default function DocumentsSection({ formData, setFormData, onInputChange }) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef();

    const handleDocumentUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = files.filter((file) => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            toast.error("Cada documento deve ter no máximo 10MB");
            return;
        }

        setIsUploading(true);
        try {
            const newDocs = files.map((file) => ({
                id: null,
                nomeArquivo: file.name,
                tipoDocumento: "outros",
                dados: URL.createObjectURL(file),
                file: file,
                tamanho: file.size,
            }));

            setFormData((prev) => ({
                ...prev,
                documentos: [...(prev.documentos || []), ...newDocs],
            }));
            toast.success("Documentos adicionados com sucesso!");
        } catch (error) {
            console.error("Erro ao processar documentos:", error);
            toast.error("Erro ao processar documentos. Tente novamente.");
        }
        setIsUploading(false);
    };

    const removeDocument = (index) => {
        setFormData((prev) => ({
            ...prev,
            documentos: (prev.documentos || []).filter((_, i) => i !== index),
        }));
        toast.success("Documento removido!");
    };

    const updateDocumentType = (index, tipo) => {
        setFormData((prev) => ({
            ...prev,
            documentos: prev.documentos.map((doc, i) =>
                i === index ? { ...doc, tipoDocumento: tipo } : doc
            ),
        }));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (fileName) => {
        const ext = fileName?.split(".").pop()?.toLowerCase();
        if (["pdf"].includes(ext)) return "📄";
        if (["doc", "docx"].includes(ext)) return "📝";
        if (["xls", "xlsx"].includes(ext)) return "📊";
        if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
        return "📎";
    };

    return (
        <div className="space-y-6">
            {/* Situação Documental */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold">Situação Documental</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Situação da Documentação</Label>
                        <Select
                            value={formData.situacaoDocumental || "nao_verificado"}
                            onValueChange={(value) =>
                                onInputChange("situacaoDocumental", value)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a situação" />
                            </SelectTrigger>
                            <SelectContent>
                                {SITUACOES_DOCUMENTAIS.map((situacao) => (
                                    <SelectItem key={situacao.value} value={situacao.value}>
                                        <span className={`px-2 py-1 rounded text-xs ${situacao.color}`}>
                                            {situacao.label}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Upload de Documentos */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <Label className="text-lg font-semibold">Documentos do Imóvel</Label>
                    <span className="text-sm text-gray-500">
                        ({(formData.documentos || []).length} arquivos)
                    </span>
                </div>

                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50/50">
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        onChange={handleDocumentUpload}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 border-orange-300 hover:bg-orange-100"
                    >
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Enviando..." : "Adicionar Documentos"}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                        PDF, DOC, XLS, JPG, PNG (máx 10MB cada)
                    </p>
                </div>

                {/* Lista de Documentos */}
                {(formData.documentos || []).length > 0 && (
                    <div className="mt-4 space-y-2">
                        {formData.documentos.map((doc, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-2xl">{getFileIcon(doc.nomeArquivo)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{doc.nomeArquivo}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(doc.tamanho || doc.file?.size || 0)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Select
                                        value={doc.tipoDocumento || "outros"}
                                        onValueChange={(value) => updateDocumentType(index, value)}
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIPOS_DOCUMENTO.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeDocument(index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Observações Internas */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <Label className="text-lg font-semibold">Observações Internas</Label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <Textarea
                        value={formData.observacoesInternas || ""}
                        onChange={(e) =>
                            onInputChange("observacoesInternas", e.target.value)
                        }
                        placeholder="Notas internas sobre o imóvel (não visíveis para clientes)..."
                        rows={4}
                        className="bg-white"
                    />
                    <p className="text-xs text-yellow-700 mt-2">
                        ⚠️ Estas observações são visíveis apenas para a equipe interna
                    </p>
                </div>
            </div>
        </div>
    );
}
