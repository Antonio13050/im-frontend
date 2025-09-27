import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MapPin, Phone, Clock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    createVisita,
    updateStatusVisita,
    updateVisita,
    deleteVisita,
} from "@/services/VisitaService";
import { parse } from "date-fns";

import VisitForm from "@/components/visitas/VisitForm";
import VisitTable from "@/components/visitas/VisitTable";
import VisitFilters from "@/components/visitas/VisitFilters";

import useVisitasData from "@/hooks/useVisitasData";
import { toast } from "sonner";

export default function VisitsPage() {
    const { user } = useAuth();
    const { visitas, imoveis, clientes, users, isLoading, reload } =
        useVisitasData(user);
    const [visits, setVisits] = useState(visitas);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingVisit, setEditingVisit] = useState(null);
    const [filters, setFilters] = useState({
        status: "todas",
        period: "todas",
    });

    useEffect(() => {
        setVisits(visitas);
    }, [visitas]);

    const handleSubmit = async (visitData) => {
        try {
            if (editingVisit) {
                await updateVisita(editingVisit.id, visitData);
            } else {
                await createVisita(visitData);
            }
            setIsFormOpen(false);
            setEditingVisit(null);
            reload();
            toast.success("Visita salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar visita:", error);
            toast.error("Erro ao salvar visita. Tente novamente.");
        }
    };

    const handleEdit = (visit) => {
        setEditingVisit(visit);
        setIsFormOpen(true);
    };

    const openNewVisitForm = () => {
        setEditingVisit(null);
        setIsFormOpen(true);
    };

    const handleStatusUpdate = async (visitId, newStatus) => {
        try {
            await updateStatusVisita(visitId, newStatus);
            toast.success("Status atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            toast.error(error.message);
        }
        reload();
    };

    const getEnrichedVisits = () => {
        const clientsMap = new Map(clientes.map((c) => [c.id, c]));
        const propertiesMap = new Map(imoveis.map((p) => [p.id, p]));
        const usersMap = new Map(users.map((u) => [u.id, u]));

        return visitas
            .map((visit) => ({
                ...visit,
                client: visit.clienteId
                    ? clientsMap.get(visit.clienteId) || {
                          nome: "Cliente não encontrado",
                      }
                    : {
                          phone: visit.clientPhone,
                          email: visit.clientEmail,
                      },
                property: propertiesMap.get(visit.imovelId) || {
                    titulo: "Imóvel não encontrado",
                    address: "Endereço não encontrado",
                },
                realtor: usersMap.get(visit.corretorId) || {
                    nome: "Corretor não encontrado",
                },
                scheduledDate: parse(
                    visit.scheduledDate,
                    "yyyy-MM-dd",
                    new Date()
                ),
            }))
            .filter((visit) => {
                const statusMatch =
                    filters.status === "todas" ||
                    visit.status === filters.status;

                let periodMatch = true;
                if (filters.period !== "todas") {
                    const visitDate = new Date(visit.scheduledDate);
                    const today = new Date();
                    visitDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    const diffTime = visitDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                    );

                    switch (filters.period) {
                        case "hoje":
                            periodMatch = diffDays === 0;
                            break;
                        case "amanha":
                            periodMatch = diffDays === 1;
                            break;
                        case "esta_semana":
                            periodMatch = diffDays >= 0 && diffDays <= 7;
                            break;
                        case "proximo_mes":
                            periodMatch = diffDays >= 0 && diffDays <= 30;
                            break;
                        default:
                            periodMatch = true;
                    }
                }

                return statusMatch && periodMatch;
            });
    };

    const getStatusColor = (status) => {
        const colors = {
            agendada: "bg-blue-100 text-blue-800",
            confirmada: "bg-green-100 text-green-800",
            realizada: "bg-emerald-100 text-emerald-800",
            cancelada: "bg-red-100 text-red-800",
            reagendada: "bg-amber-100 text-amber-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const enrichedVisits = getEnrichedVisits();

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Gestão de Visitas
                                </h1>
                                <p className="text-gray-600">
                                    Acompanhe e gerencie todas as visitas
                                    agendadas
                                </p>
                            </div>
                            <Button
                                onClick={openNewVisitForm}
                                className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nova Visita
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total de Visitas
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {visits.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <Clock className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Hoje
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            visits.filter((v) => {
                                                const visitDate = new Date(
                                                    v.scheduled_date
                                                );
                                                const today = new Date();
                                                return (
                                                    visitDate.toDateString() ===
                                                    today.toDateString()
                                                );
                                            }).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-8 h-8 text-amber-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Realizadas
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            visits.filter(
                                                (v) => v.status === "realizada"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <Phone className="w-8 h-8 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Pendentes
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {
                                            visits.filter((v) =>
                                                [
                                                    "agendada",
                                                    "confirmada",
                                                ].includes(v.status)
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingVisit ? "Editar Visita" : "Nova Visita"}
                            </DialogTitle>
                        </DialogHeader>
                        <VisitForm
                            visit={editingVisit}
                            onSubmit={handleSubmit}
                            setOpen={setIsFormOpen}
                            clients={clientes}
                            properties={imoveis}
                            users={users}
                            currentUserRole={user?.scope}
                        />
                    </DialogContent>

                    <div className="bg-white rounded-xl shadow-sm border mb-6">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Filtros
                            </h2>
                        </div>
                        <div className="p-6">
                            <VisitFilters
                                filters={filters}
                                onFilterChange={setFilters}
                            />
                        </div>
                    </div>

                    <VisitTable
                        visits={enrichedVisits}
                        onEdit={handleEdit}
                        onStatusUpdate={handleStatusUpdate}
                        getStatusColor={getStatusColor}
                        users={users}
                        currentUser={user}
                    />
                </div>
            </div>
        </Dialog>
    );
}
