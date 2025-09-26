import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, FileText, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ProcessForm from "@/components/processos/ProcessoForm";
import ProcessTable from "@/components/processos/ProcessTable";
import ProcessFilters from "@/components/processos/ProcessoFilters";
import ProcessDetailsModal from "@/components/processos//ProcessDetailsModal";

import useProcessosData from "@/hooks/useProcessosData";
import {
    createProcesso,
    updateStatus,
    updateProcesso,
} from "@/services/ProcessoService";
import { toast } from "sonner";

export default function Processos() {
    const { user } = useAuth();
    const { allProcessos, imoveis, clientes, users, isLoading, reload } =
        useProcessosData(user);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProcess, setEditingProcess] = useState(null);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "todos",
        period: "todos",
    });
    const [processos, setProcessos] = useState(allProcessos);

    useEffect(() => {
        setProcessos(allProcessos);
    }, [allProcessos]);

    const handleSubmit = async (processData) => {
        try {
            if (editingProcess) {
                await updateProcesso(editingProcess.id, processData);
            } else {
                await createProcesso(processData);
            }
            setIsFormOpen(false);
            setEditingProcess(null);
            reload();
            toast.success("Processo salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar processo:", error);
            toast.error("Erro ao salvar processo. Tente novamente.");
        }
    };

    const handleEdit = (processo) => {
        setEditingProcess(processo);
        setIsFormOpen(true);
    };

    const handleViewDetails = (processo) => {
        setSelectedProcess(processo);
        setIsDetailsOpen(true);
    };

    const openNewProcessForm = () => {
        setEditingProcess(null);
        setIsFormOpen(true);
    };

    const handleStatusUpdate = async (
        processoId,
        newStatus,
        statusChangeNotes,
        additionalData = {}
    ) => {
        try {
            await updateStatus(processoId, newStatus, statusChangeNotes);
            toast.success("Status atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            toast.error(error.message);
        }

        const updatedProcesses = processos.map((p) =>
            p.id === processoId
                ? {
                      ...p,
                      status: newStatus,
                      statusChangeNotes,
                      ...additionalData,
                  }
                : p
        );
        setProcessos(updatedProcesses);
        if (selectedProcess?.id === processoId) {
            setSelectedProcess((prev) => ({
                ...prev,
                status: newStatus,
                ...additionalData,
            }));
        }
    };

    const getEnrichedProcessos = () => {
        const clientsMap = new Map(clientes.map((c) => [c.id, c]));
        const propertiesMap = new Map(imoveis.map((p) => [p.id, p]));

        return processos
            .map((processo) => ({
                ...processo,
                cliente: clientsMap.get(processo.clienteId) || {
                    nome: "Cliente não encontrado",
                    telefone: "Telefone não disponível",
                    email: null,
                },
                imovel: propertiesMap.get(processo.imovelId) || {
                    titulo: "Imóvel não encontrado",
                },
            }))
            .filter((processo) => {
                const statusMatch =
                    filters.status === "todos" ||
                    processo.status === filters.status;
                let periodMatch = true;
                if (filters.period !== "todos") {
                    const processDate = new Date(processo.createdDate);
                    const today = new Date();
                    const diffDays = Math.ceil(
                        (today - processDate) / (1000 * 60 * 60 * 24)
                    );

                    switch (filters.period) {
                        case "ultimos_7_dias":
                            periodMatch = diffDays <= 7;
                            break;
                        case "ultimo_mes":
                            periodMatch = diffDays <= 30;
                            break;
                        case "ultimos_3_meses":
                            periodMatch = diffDays <= 90;
                            break;
                    }
                }

                return statusMatch && periodMatch;
            });
    };

    const getStatusColor = (status) => {
        const colors = {
            interesse_manifestado: "bg-blue-100 text-blue-800",
            proposta_enviada: "bg-purple-100 text-purple-800",
            negociacao: "bg-amber-100 text-amber-800",
            proposta_aceita: "bg-green-100 text-green-800",
            documentacao_pendente: "bg-yellow-100 text-yellow-800",
            analise_credito: "bg-indigo-100 text-indigo-800",
            aprovacao_financeira: "bg-teal-100 text-teal-800",
            contrato_assinado: "bg-emerald-100 text-emerald-800",
            vistoria_agendada: "bg-cyan-100 text-cyan-800",
            vistoria_realizada: "bg-lime-100 text-lime-800",
            entrega_chaves: "bg-green-200 text-green-900",
            processo_concluido: "bg-emerald-200 text-emerald-900",
            cancelado: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getProcessStats = () => {
        const stats = {
            total: processos.length,
            active: processos.filter(
                (p) => !["processo_concluido", "cancelado"].includes(p.status)
            ).length,
            completed: processos.filter(
                (p) => p.status === "processo_concluido"
            ).length,
            cancelled: processos.filter((p) => p.status === "cancelado").length,
        };
        return stats;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const stats = getProcessStats();
    const enrichedProcessos = getEnrichedProcessos();
    const imoveisDisponiveis = imoveis.filter((i) => i.status === "disponivel");

    return (
        <>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[825px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProcess
                                ? "Editar Processo"
                                : "Novo Processo"}
                        </DialogTitle>
                    </DialogHeader>
                    <ProcessForm
                        processo={editingProcess}
                        onSubmit={handleSubmit}
                        setOpen={setIsFormOpen}
                        clientes={clientes}
                        imoveis={imoveisDisponiveis}
                    />
                </DialogContent>
            </Dialog>

            <ProcessDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                processo={selectedProcess}
                onStatusUpdate={handleStatusUpdate}
                getStatusColor={getStatusColor}
                users={users}
                currentUser={user}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Gestão de Processos
                                </h1>
                                <p className="text-gray-600">
                                    Acompanhe o fluxo completo dos processos
                                    imobiliários
                                </p>
                            </div>
                            <Button
                                onClick={openNewProcessForm}
                                className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Novo Processo
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Processos
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.total}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-8 h-8 text-amber-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Em Andamento
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.active}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Concluídos
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.completed}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <XCircle className="w-8 h-8 text-red-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Cancelados
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.cancelled}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Filtros
                                </h2>
                            </div>
                            <div className="p-6">
                                <ProcessFilters
                                    filters={filters}
                                    onFilterChange={setFilters}
                                />
                            </div>
                        </div>

                        <ProcessTable
                            processos={enrichedProcessos}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            getStatusColor={getStatusColor}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
