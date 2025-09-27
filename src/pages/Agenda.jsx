import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    User as UserIcon,
} from "lucide-react";
import {
    format,
    startOfWeek,
    addDays,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    parse,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import VisitCard from "@/components/visitas/VisitCard";
import VisitForm from "@/components/visitas/VisitForm";
import { useAuth } from "@/contexts/AuthContext";
import useVisitasData from "@/hooks/useVisitasData";
import { updateStatusVisita, updateVisita } from "@/services/VisitaService";

const Agenda = () => {
    const { user } = useAuth();
    const { visitas, imoveis, clientes, users, isLoading, reload } =
        useVisitasData(user);
    const [visits, setVisits] = useState([]);
    const [enrichedVisits, setEnrichedVisits] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState("semana");
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setVisits(visitas);
        const validClientes = clientes.filter((c) => c.id && c.id !== "");
        const validImoveis = imoveis.filter((i) => i.id && i.id !== "");
        const validUsers = users.filter((u) => u.userId && u.userId !== "");
        const clientsMap = new Map(validClientes.map((c) => [c.id, c]));
        const propertiesMap = new Map(validImoveis.map((p) => [p.id, p]));

        const enriched = visitas.map((visit) => ({
            ...visit,
            scheduledDate: parse(visit.scheduledDate, "yyyy-MM-dd", new Date()),
            client: clientsMap.get(visit.clienteId) || {
                nome: "Cliente não encontrado",
            },
            property: propertiesMap.get(visit.imovelId) || {
                titulo: "Imóvel não encontrado",
            },
        }));
        setEnrichedVisits(enriched);
    }, [visitas, clientes, imoveis]);

    const handleStatusUpdate = async (visitId, newStatus) => {
        try {
            if (selectedVisit && selectedVisit.id === visitId) {
                setSelectedVisit((prev) => ({ ...prev, status: newStatus }));
            }
            setEnrichedVisits((prev) =>
                prev.map((visit) =>
                    visit.id === visitId
                        ? { ...visit, status: newStatus }
                        : visit
                )
            );

            await updateStatusVisita(visitId, newStatus);
            toast.success("Status atualizado com sucesso!");
            reload();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            toast.error(
                error.message || "Erro ao atualizar status. Tente novamente."
            );

            if (selectedVisit && selectedVisit.id === visitId) {
                setSelectedVisit((prev) => ({ ...prev, status: prev.status }));
            }
            setEnrichedVisits((prev) =>
                prev.map((visit) =>
                    visit.id === visitId
                        ? { ...visit, status: visit.status }
                        : visit
                )
            );
            reload();
        }
    };

    const handleEdit = (visit) => {
        setSelectedVisit(visit);
        setIsEditing(true);
    };

    const handleEditSubmit = async (formData) => {
        try {
            await updateVisita(selectedVisit.id, formData);
            toast.success("Visita atualizada com sucesso!");
            setIsEditing(false);
            setSelectedVisit(null);
            reload();
        } catch (error) {
            console.error("Erro ao atualizar visita:", error);
            toast.error(
                error.message || "Erro ao atualizar visita. Tente novamente."
            );
        }
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
        setSelectedVisit(null);
    };

    const changeDate = (amount) => {
        if (view === "semana") {
            setCurrentDate((prev) => addDays(prev, amount * 7));
        } else {
            setCurrentDate(
                (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() + amount, 1)
            );
        }
    };

    const getVisitsForDay = (day) => {
        return enrichedVisits
            .filter((visit) => isSameDay(visit.scheduledDate, day))
            .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    };

    const renderWeekView = () => {
        const start = startOfWeek(currentDate, { locale: ptBR });
        const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

        return (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {days.map((day) => (
                    <div
                        key={day.toString()}
                        className="bg-white rounded-lg border p-3"
                    >
                        <p className="font-bold text-center text-sm">
                            {format(day, "EEE", { locale: ptBR }).toUpperCase()}
                        </p>
                        <p className="text-center text-2xl font-light mb-4">
                            {format(day, "d")}
                        </p>
                        <div className="space-y-2">
                            {getVisitsForDay(day).map((visit) => (
                                <div
                                    key={visit.id}
                                    className="bg-blue-50 p-2 rounded text-xs border-l-2 border-blue-400 cursor-pointer hover:bg-blue-100"
                                    onClick={() => setSelectedVisit(visit)}
                                >
                                    <p className="font-semibold truncate">
                                        {visit.client.nome}
                                    </p>
                                    <p>
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        {visit.scheduledTime}
                                    </p>
                                    <p className="truncate">
                                        <MapPin className="w-3 h-3 inline mr-1" />
                                        {visit.property.titulo}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderMonthView = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const days = eachDayOfInterval({ start, end });
        const firstDayOfMonth = start.getDay();

        return (
            <div className="grid grid-cols-7">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (day) => (
                        <div
                            key={day}
                            className="text-center font-bold p-2 border-b"
                        >
                            {day}
                        </div>
                    )
                )}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="border-r border-b h-32"
                    ></div>
                ))}
                {days.map((day) => {
                    const dayVisits = getVisitsForDay(day);
                    return (
                        <div
                            key={day.toString()}
                            className="border-r border-b h-32 p-1 overflow-y-auto"
                        >
                            <span
                                className={`font-medium ${
                                    isSameDay(day, new Date())
                                        ? "text-blue-600"
                                        : ""
                                }`}
                            >
                                {format(day, "d")}
                            </span>
                            <div className="space-y-1 mt-1">
                                {dayVisits.map((visit) => (
                                    <div
                                        key={visit.id}
                                        className="bg-blue-50 p-1 rounded text-xs truncate cursor-pointer hover:bg-blue-100"
                                        onClick={() => setSelectedVisit(visit)}
                                    >
                                        {visit.scheduledTime} -{" "}
                                        {visit.client.nome}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
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

    const validClientes = clientes.filter((c) => c.id && c.id !== "");
    const validImoveis = imoveis.filter((i) => i.id && i.id !== "");
    const validUsers = users.filter((u) => u.userId && u.userId !== "");

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <CalendarIcon />
                            Agenda de Visitas
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => changeDate(-1)}
                                >
                                    <ChevronLeft />
                                </Button>
                                <span className="font-semibold w-48 text-center">
                                    {format(
                                        currentDate,
                                        view === "semana"
                                            ? "'Semana de' dd 'de' MMMM"
                                            : "MMMM yyyy",
                                        { locale: ptBR }
                                    )}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => changeDate(1)}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    variant={
                                        view === "semana"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setView("semana")}
                                    className="rounded-r-none"
                                >
                                    Semana
                                </Button>
                                <Button
                                    variant={
                                        view === "mes" ? "default" : "outline"
                                    }
                                    onClick={() => setView("mes")}
                                    className="rounded-l-none"
                                >
                                    Mês
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p>Carregando agenda...</p>
                    ) : view === "semana" ? (
                        renderWeekView()
                    ) : (
                        renderMonthView()
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={!!selectedVisit}
                onOpenChange={() => {
                    setSelectedVisit(null);
                    setIsEditing(false);
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? "Editar Visita" : "Detalhes da Visita"}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedVisit && (
                        <div className="pt-4">
                            {isEditing ? (
                                <VisitForm
                                    visit={{
                                        ...selectedVisit,
                                        clienteId:
                                            selectedVisit.clienteId?.toString() ||
                                            "",
                                        imovelId:
                                            selectedVisit.imovelId?.toString() ||
                                            "",
                                        corretorId:
                                            selectedVisit.corretorId?.toString() ||
                                            "",
                                    }}
                                    onSubmit={handleEditSubmit}
                                    setOpen={handleCloseEdit}
                                    clients={validClientes}
                                    properties={validImoveis}
                                    users={validUsers}
                                    currentUserRole={user?.scope}
                                />
                            ) : (
                                <VisitCard
                                    visit={selectedVisit}
                                    onEdit={() => handleEdit(selectedVisit)}
                                    onStatusUpdate={handleStatusUpdate}
                                    getStatusColor={getStatusColor}
                                />
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Agenda;
