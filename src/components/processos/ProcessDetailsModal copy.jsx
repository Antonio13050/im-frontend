import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    FileText,
    Phone,
    Mail,
    DollarSign,
    Calendar,
    Building,
    Download,
    Plus,
    MapPin,
    User,
    History,
    Save,
    Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner"; // For notifications
import { fetchHistory } from "@/services/ProcessoHistoryService";
import {
    uploadDocument,
    getDocumentsByProcessId,
    downloadDocument,
    deleteDocument,
} from "@/services/ProcessoService"; // Updated import

const ALL_STATUSES = [
    "interesse_manifestado",
    "proposta_enviada",
    "negociacao",
    "proposta_aceita",
    "documentacao_pendente",
    "analise_credito",
    "aprovacao_financeira",
    "contrato_assinado",
    "vistoria_agendada",
    "vistoria_realizada",
    "entrega_chaves",
    "processo_concluido",
    "cancelado",
];

export default function ProcessDetailsModal({
    isOpen,
    onClose,
    processo,
    onStatusUpdate,
    getStatusColor,
    users,
    currentUser,
}) {
    const [documents, setDocuments] = useState([]);
    const [statusHistory, setStatusHistory] = useState([]);
    const [usersMap, setUsersMap] = useState(new Map());
    const [uploading, setUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [newDocument, setNewDocument] = useState({
        document_name: "",
        document_type: "outros",
        file: null,
    });
    const [newStatus, setNewStatus] = useState("");
    const [statusChangeNotes, setStatusChangeNotes] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // For delete confirmation
    const [documentToDelete, setDocumentToDelete] = useState(null); // Track document to delete

    useEffect(() => {
        if (processo) {
            setNewStatus(processo.status);
        }
    }, [processo]);

    useEffect(() => {
        const map = new Map(users.map((u) => [u.userId, u.nome]));
        if (currentUser) {
            map.set(Number(currentUser.sub), currentUser.nome);
        }
        setUsersMap(map);
    }, [users, currentUser]);

    const loadData = useCallback(async () => {
        if (!processo) return;
        try {
            const [history, docs] = await Promise.all([
                fetchHistory(processo.id),
                getDocumentsByProcessId(processo.id),
            ]);
            setStatusHistory(history);
            setDocuments(docs);
        } catch (error) {
            console.error("Erro ao carregar dados do modal:", error);
            toast.error("Erro ao carregar dados. Tente novamente.");
        }
    }, [processo]);

    useEffect(() => {
        if (processo && isOpen) {
            loadData();
        }
    }, [processo, isOpen, loadData]);

    const handleStatusSave = async () => {
        if (newStatus === processo.status) return;

        try {
            await onStatusUpdate(processo.id, newStatus, statusChangeNotes);
            setStatusChangeNotes("");
            loadData();
            toast.success("Status atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar o status: ", error);
            toast.error("Erro ao atualizar status. Tente novamente.");
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!newDocument.file || !newDocument.document_name) return;

        setUploading(true);
        try {
            const savedDocument = await uploadDocument({
                processId: processo.id,
                documentName: newDocument.document_name,
                documentType: newDocument.document_type,
                file: newDocument.file,
            });
            setDocuments((prev) => [...prev, savedDocument]);
            setNewDocument({
                document_name: "",
                document_type: "outros",
                file: null,
            });
            setShowUploadForm(false);
            toast.success("Documento enviado com sucesso!");
        } catch (error) {
            console.error("Erro ao fazer upload:", error);
            toast.error("Erro ao enviar documento. Tente novamente.");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (documentId, fileName) => {
        try {
            const response = await downloadDocument(documentId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Documento baixado com sucesso!");
        } catch (error) {
            console.error("Erro ao baixar documento:", error);
            toast.error("Erro ao baixar documento. Tente novamente.");
        }
    };

    const handleDelete = async () => {
        if (!documentToDelete) return;

        try {
            await deleteDocument(documentToDelete.id);
            setDocuments((prev) =>
                prev.filter((doc) => doc.id !== documentToDelete.id)
            );
            setShowDeleteConfirm(false);
            setDocumentToDelete(null);
            toast.success("Documento excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir documento:", error);
            toast.error("Erro ao excluir documento. Tente novamente.");
        }
    };

    const confirmDelete = (document) => {
        setDocumentToDelete(document);
        setShowDeleteConfirm(true);
    };

    const getStatusLabel = (status) => {
        const labels = {
            interesse_manifestado: "Interesse Manifestado",
            proposta_enviada: "Proposta Enviada",
            negociacao: "Negociação",
            proposta_aceita: "Proposta Aceita",
            documentacao_pendente: "Documentação Pendente",
            analise_credito: "Análise de Crédito",
            aprovacao_financeira: "Aprovação Financeira",
            contrato_assinado: "Contrato Assinado",
            vistoria_agendada: "Vistoria Agendada",
            vistoria_realizada: "Vistoria Realizada",
            entrega_chaves: "Entrega das Chaves",
            processo_concluido: "Processo Concluído",
            cancelado: "Cancelado",
        };
        return labels[status] || status;
    };

    const getDocumentTypeLabel = (type) => {
        const labels = {
            rg_cliente: "RG do Cliente",
            cpf_cliente: "CPF do Cliente",
            comprovante_renda: "Comprovante de Renda",
            comprovante_residencia: "Comprovante de Residência",
            certidao_nascimento: "Certidão de Nascimento",
            certidao_casamento: "Certidão de Casamento",
            imposto_renda: "Imposto de Renda",
            escritura_imovel: "Escritura do Imóvel",
            iptu: "IPTU",
            certidao_negativa: "Certidão Negativa",
            contrato_compra_venda: "Contrato de Compra e Venda",
            financiamento_documentos: "Documentos do Financiamento",
            vistoria_laudo: "Laudo de Vistoria",
            outros: "Outros",
        };
        return labels[type] || type;
    };

    const getFinancingTypeLabel = (type) => {
        const labels = {
            vista: "À Vista",
            financiamento: "Financiamento",
            consorcio: "Consórcio",
        };
        return labels[type] || type;
    };

    if (!processo) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="sticky top-0 bg-white z-10 border-b pb-4">
                        <DialogTitle className="flex items-center justify-between">
                            <span>Processo: {processo.imovel.titulo}</span>
                            <Badge className={getStatusColor(newStatus)}>
                                {getStatusLabel(newStatus)}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-4">
                        {/* Process Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="w-5 h-5" />
                                        Informações do Imóvel
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                        <div>
                                            <p className="font-medium">
                                                {processo.imovel.titulo}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {processo.imovel.endereco ||
                                                    "Endereço não disponível"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500" />
                                        <span>
                                            R${" "}
                                            {processo.imovel.preco?.toLocaleString(
                                                "pt-BR",
                                                { minimumFractionDigits: 2 }
                                            )}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Informações do Cliente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="font-medium">
                                            {processo.cliente.nome}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span>{processo.cliente.telefone}</span>
                                    </div>
                                    {processo.cliente.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span>
                                                {processo.cliente.email}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span>
                                            Criado em{" "}
                                            {format(
                                                new Date(processo.createdDate),
                                                "dd/MM/yyyy",
                                                { locale: ptBR }
                                            )}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Process Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalhes do Processo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {processo.valorProposto && (
                                        <div>
                                            <Label className="text-sm text-gray-600">
                                                Valor Proposto
                                            </Label>
                                            <p className="font-medium">
                                                R${" "}
                                                {processo.valorProposto.toLocaleString(
                                                    "pt-BR",
                                                    { minimumFractionDigits: 2 }
                                                )}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <Label className="text-sm text-gray-600">
                                            Tipo de Financiamento
                                        </Label>
                                        <p className="font-medium">
                                            {getFinancingTypeLabel(
                                                processo.tipoFinanciamento
                                            )}
                                        </p>
                                        {processo.nomeBanco && (
                                            <p className="text-sm text-gray-600">
                                                {processo.nomeBanco}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {processo.observacoes && (
                                    <div>
                                        <Label className="text-sm text-gray-600">
                                            Observações
                                        </Label>
                                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm">
                                                {processo.observacoes}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Update */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Alterar Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="status-select">
                                            Novo Status
                                        </Label>
                                        <Select
                                            value={newStatus}
                                            onValueChange={setNewStatus}
                                        >
                                            <SelectTrigger id="status-select">
                                                <SelectValue placeholder="Selecione um status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ALL_STATUSES.map((status) => (
                                                    <SelectItem
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {getStatusLabel(status)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="self-end">
                                        <Button
                                            onClick={handleStatusSave}
                                            disabled={
                                                newStatus === processo.status
                                            }
                                            className="w-full"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Salvar Status
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="status-notes">
                                        Observações (Opcional)
                                    </Label>
                                    <Textarea
                                        id="status-notes"
                                        value={statusChangeNotes}
                                        onChange={(e) =>
                                            setStatusChangeNotes(e.target.value)
                                        }
                                        placeholder="Adicione uma observação sobre a mudança de status..."
                                        rows={2}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-5 h-5" />
                                    Histórico de Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {statusHistory.length === 0 ? (
                                        <p className="text-gray-500 text-sm">
                                            Nenhuma alteração de status
                                            registrada.
                                        </p>
                                    ) : (
                                        <ul className="space-y-4">
                                            {statusHistory.map((entry) => (
                                                <li
                                                    key={entry.id}
                                                    className="flex gap-4"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-4 h-4 rounded-full bg-blue-500 mt-1"></div>
                                                        <div className="flex-1 w-px bg-gray-300"></div>
                                                    </div>
                                                    <div className="pb-4 flex-1">
                                                        <p className="font-medium">
                                                            {!entry.oldStatus ? (
                                                                <p className="text-sm">
                                                                    {
                                                                        "Processo Criado"
                                                                    }
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    {`De `}{" "}
                                                                    <Badge variant="outline">
                                                                        {getStatusLabel(
                                                                            entry.oldStatus
                                                                        )}
                                                                    </Badge>
                                                                    {` para `}{" "}
                                                                    <Badge
                                                                        className={getStatusColor(
                                                                            entry.newStatus
                                                                        )}
                                                                    >
                                                                        {getStatusLabel(
                                                                            entry.newStatus
                                                                        )}
                                                                    </Badge>
                                                                </>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Por{" "}
                                                            {usersMap.get(
                                                                entry.createdBy
                                                            ) ||
                                                                entry.createdBy}{" "}
                                                            em{" "}
                                                            {format(
                                                                new Date(
                                                                    entry.createdDate
                                                                ),
                                                                "dd/MM/yyyy 'às' HH:mm",
                                                                { locale: ptBR }
                                                            )}
                                                        </p>
                                                        {entry.observacoes && (
                                                            <div className="mt-2 p-2 bg-gray-50 border rounded-md">
                                                                <p className="text-sm text-gray-700">
                                                                    {
                                                                        entry.observacoes
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Documentos ({documents.length})</span>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            setShowUploadForm(!showUploadForm)
                                        }
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {showUploadForm && (
                                    <form
                                        onSubmit={handleFileUpload}
                                        className="space-y-4 p-4 bg-gray-50 rounded-lg mb-4"
                                    >
                                        <div>
                                            <Label>Nome do Documento</Label>
                                            <Input
                                                value={
                                                    newDocument.document_name
                                                }
                                                onChange={(e) =>
                                                    setNewDocument((prev) => ({
                                                        ...prev,
                                                        document_name:
                                                            e.target.value,
                                                    }))
                                                }
                                                placeholder="Ex: RG do Cliente"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label>Tipo de Documento</Label>
                                            <Select
                                                value={
                                                    newDocument.document_type
                                                }
                                                onValueChange={(value) =>
                                                    setNewDocument((prev) => ({
                                                        ...prev,
                                                        document_type: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="rg_cliente">
                                                        RG do Cliente
                                                    </SelectItem>
                                                    <SelectItem value="cpf_cliente">
                                                        CPF do Cliente
                                                    </SelectItem>
                                                    <SelectItem value="comprovante_renda">
                                                        Comprovante de Renda
                                                    </SelectItem>
                                                    <SelectItem value="comprovante_residencia">
                                                        Comprovante de
                                                        Residência
                                                    </SelectItem>
                                                    <SelectItem value="outros">
                                                        Outros
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Arquivo</Label>
                                            <Input
                                                type="file"
                                                onChange={(e) =>
                                                    setNewDocument((prev) => ({
                                                        ...prev,
                                                        file: e.target.files[0],
                                                    }))
                                                }
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                required
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="submit"
                                                disabled={uploading}
                                                size="sm"
                                            >
                                                {uploading
                                                    ? "Enviando..."
                                                    : "Enviar"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowUploadForm(false)
                                                }
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-3">
                                    {documents.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>Nenhum documento enviado</p>
                                        </div>
                                    ) : (
                                        documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {doc.documentName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {getDocumentTypeLabel(
                                                                doc.documentType
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {doc.status ===
                                                        "enviado"
                                                            ? "Enviado"
                                                            : doc.status}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleDownload(
                                                                doc.id,
                                                                doc.fileName
                                                            )
                                                        }
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            confirmDelete(doc)
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Tem certeza que deseja excluir o documento "
                        {documentToDelete?.documentName}"? Esta ação não pode
                        ser desfeita.
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
