import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    Phone,
    Mail,
    MapPin,
    Edit,
    CheckCircle,
    XCircle,
    RotateCcw,
    MessageSquare,
    ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function VisitCard({
    visit,
    onEdit,
    onStatusUpdate,
    getStatusColor,
}) {
    const getStatusLabel = (status) => {
        const labels = {
            agendada: "Agendada",
            confirmada: "Confirmada",
            realizada: "Realizada",
            cancelada: "Cancelada",
            reagendada: "Reagendada",
        };
        return labels[status] || status;
    };

    const handleStatusChange = (newStatus) => {
        onStatusUpdate(visit.id, newStatus);
    };
    const handleWhatsAppClick = () => {
        const phoneNumber = visit.client.telefone.replace(/[^\d]/g, "");
        const clientName = visit.client.nome || "cliente";
        const propertyTitle = visit.property.titulo || "imóvel";

        const message = encodeURIComponent(
            `Olá ${clientName}! ` +
                `Gostaria de confirmar nossa visita ao ${propertyTitle} ` +
                `agendada para ${format(visit.scheduledDate, "dd/MM/yyyy", {
                    locale: ptBR,
                })} às ${visit.scheduledTime}. ` +
                `Por favor, confirme sua disponibilidade.`
        );
        // Assuming Brazilian phone numbers for "55" prefix
        window.open(`https://wa.me/55${phoneNumber}?text=${message}`, "_blank");
    };

    const isExpired =
        visit.scheduledDate < new Date() && visit.status === "agendada";

    const isTomorrow = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const visitDate = new Date(visit.scheduledDate);
        visitDate.setHours(0, 0, 0, 0);
        return visitDate.getTime() === tomorrow.getTime();
    };

    return (
        <Card
            className={`shadow-md hover:shadow-lg transition-all duration-200 border-l-4 ${
                visit.status === "realizada"
                    ? "border-l-green-500"
                    : visit.status === "cancelada"
                    ? "border-l-red-500"
                    : visit.status === "confirmada"
                    ? "border-l-blue-500"
                    : isExpired
                    ? "border-l-amber-500"
                    : "border-l-gray-300"
            }`}
        >
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {visit.property.titulo}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {visit.client.nome}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(visit.status)}>
                            {getStatusLabel(visit.status)}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar Visita
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {isTomorrow() &&
                                    visit.status === "agendada" && (
                                        <DropdownMenuItem
                                            onClick={handleWhatsAppClick}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2 text-green-500" />
                                            Confirmar via WhatsApp
                                        </DropdownMenuItem>
                                    )}
                                {visit.status !== "confirmada" &&
                                    visit.status !== "realizada" && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleStatusChange("confirmada")
                                            }
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                                            Confirmar
                                        </DropdownMenuItem>
                                    )}
                                {visit.status !== "realizada" &&
                                    visit.status !== "cancelada" && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleStatusChange("realizada")
                                            }
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                            Marcar como Realizada
                                        </DropdownMenuItem>
                                    )}
                                {visit.status !== "cancelada" &&
                                    visit.status !== "realizada" && (
                                        <>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleStatusChange(
                                                        "reagendada"
                                                    )
                                                }
                                            >
                                                <RotateCcw className="w-4 h-4 mr-2 text-amber-500" />
                                                Reagendar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleStatusChange(
                                                        "cancelada"
                                                    )
                                                }
                                            >
                                                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                                Cancelar
                                            </DropdownMenuItem>
                                        </>
                                    )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {format(visit.scheduledDate, "dd 'de' MMMM, yyyy", {
                                locale: ptBR,
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{visit.scheduledTime}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{visit.client.telefone}</span>
                    </div>

                    {visit.client.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{visit.client.email}</span>
                        </div>
                    )}
                </div>

                {visit.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                            <p className="text-sm text-gray-700">
                                {visit.notes}
                            </p>
                        </div>
                    </div>
                )}

                {visit.clientFeedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                            Feedback do Cliente:
                        </h4>
                        <p className="text-sm text-blue-700">
                            {visit.clientFeedback}
                        </p>
                        {visit.interestLevel && (
                            <Badge className="mt-2 bg-blue-100 text-blue-800">
                                Interesse: {visit.interestLevel}
                            </Badge>
                        )}
                    </div>
                )}

                {isExpired && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                            ⚠️ Esta visita já passou da data agendada
                        </p>
                    </div>
                )}

                {isTomorrow() && visit.status === "agendada" && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Visita marcada para amanhã - considere confirmar
                            com o cliente
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
