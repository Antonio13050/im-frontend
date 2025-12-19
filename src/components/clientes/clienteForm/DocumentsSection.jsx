import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

const TIPOS_DOCUMENTO_CLIENTE = [
    { value: "rg", label: "RG - Carteira de Identidade" },
    { value: "cpf", label: "CPF - Cadastro de Pessoa Física" },
    { value: "cnh", label: "CNH - Carteira de Habilitação" },
    { value: "comprovante_residencia", label: "Comprovante de Residência" },
    { value: "comprovante_renda", label: "Comprovante de Renda" },
    { value: "certidao_casamento", label: "Certidão de Casamento" },
    { value: "certidao_nascimento", label: "Certidão de Nascimento" },
    { value: "contrato_locacao", label: "Contrato de Locação" },
    { value: "declaracao_imposto", label: "Declaração de Imposto de Renda" },
    { value: "outros", label: "Outros" },
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
                tipoConteudo: file.type,
            }));

            setFormData((prev) => ({
                ...prev,
                documentos: [...(prev.documentos || []), ...newDocs],
            }));
            toast.success("Documentos adicionados com sucesso!");
        } catch (error) {
            console.error("Erro ao processar documentos:", error);
            toast.error("Erro ao processar documentos. Tente novamente.");
        } finally {
            setIsUploading(false);
        }
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
        if (!bytes) return "0 B";
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
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-orange-600" />
                <Label className="text-lg font-semibold">Documentos do Cliente</Label>
                <span className="text-sm text-gray-500">
                    ({(formData.documentos || []).length} arquivos)
                </span>
            </div>

            {/* Upload de Documentos */}
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
                                <span className="text-2xl">
                                    {getFileIcon(doc.nomeArquivo)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {doc.nomeArquivo}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(doc.tamanho || doc.file?.size || 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Select
                                    value={doc.tipoDocumento || "outros"}
                                    onValueChange={(value) =>
                                        updateDocumentType(index, value)
                                    }
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIPOS_DOCUMENTO_CLIENTE.map((tipo) => (
                                            <SelectItem
                                                key={tipo.value}
                                                value={tipo.value}
                                            >
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

            {(!formData.documentos || formData.documentos.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum documento adicionado ainda.</p>
                    <p className="text-sm">Clique em "Adicionar Documentos" para começar.</p>
                </div>
            )}
        </div>
    );
}
