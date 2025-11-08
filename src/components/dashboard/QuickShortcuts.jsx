import React from "react";
import { Link } from "react-router-dom";
import {
    Home,
    Users,
    Plus,
    Calendar,
    FileText,
    Megaphone,
    MapPin,
    CheckSquare,
    UserPlus,
    Funnel,
    Edit,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const shortcuts = [
    {
        id: "imoveis",
        label: "Imóveis",
        icon: Home,
        link: "/imoveis",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        id: "funil",
        label: "Funil neg. ou cartão",
        icon: Funnel,
        link: "/leads",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        id: "novo-negocio",
        label: "Novo neg. ou cartão",
        icon: Plus,
        link: "/leads/new",
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        id: "contatos",
        label: "Contatos",
        icon: Users,
        link: "/clientes",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
    },
    {
        id: "novo-contato",
        label: "Novo contato",
        icon: UserPlus,
        link: "/clientes/new",
        color: "text-cyan-600",
        bgColor: "bg-cyan-50",
    },
    {
        id: "agenda",
        label: "Agenda",
        icon: Calendar,
        link: "/agenda",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
    {
        id: "relatorios",
        label: "Relatórios",
        icon: FileText,
        link: "/relatorio-admin",
        color: "text-red-600",
        bgColor: "bg-red-50",
    },
    {
        id: "anuncios",
        label: "Anúncios",
        icon: Megaphone,
        link: "#",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
    },
    {
        id: "novo-imovel",
        label: "Novo imóvel",
        icon: Home,
        link: "/imoveis/new",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        id: "nova-visita",
        label: "Nova visita",
        icon: MapPin,
        link: "/visitas/new",
        color: "text-teal-600",
        bgColor: "bg-teal-50",
    },
    {
        id: "nova-tarefa",
        label: "Nova tarefa",
        icon: CheckSquare,
        link: "/agenda",
        color: "text-pink-600",
        bgColor: "bg-pink-50",
    },
    {
        id: "leads",
        label: "Leads",
        icon: Users,
        link: "/leads",
        color: "text-violet-600",
        bgColor: "bg-violet-50",
    },
];

export default function QuickShortcuts() {
    return (
        <div className="mb-8">
            <div className="mt-4 no-scrollbar overflow-x-auto md:overflow-x-visible">
                <div
                    className="
      flex md:flex-wrap gap-3 pb-2 
      justify-start
      min-w-max md:min-w-0
    "
                >
                    {shortcuts.map((shortcut) => {
                        const Icon = shortcut.icon;
                        return (
                            <Link
                                key={shortcut.id}
                                to={shortcut.link}
                                className="block flex-shrink-0"
                            >
                                <Card className="w-24 h-24 p-2 flex flex-col items-center justify-center text-center gap-1 hover:shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer border-gray-200 rounded-lg">
                                    <div
                                        className={`w-8 h-8 ${shortcut.bgColor} rounded-md flex items-center justify-center`}
                                    >
                                        <Icon
                                            className={`w-4 h-4 ${shortcut.color}`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-700 leading-tight line-clamp-2">
                                        {shortcut.label}
                                    </span>
                                </Card>
                            </Link>
                        );
                    })}

                    {/* Botão de editar */}
                    <Card className="w-24 h-24 p-2 flex flex-col items-center justify-center text-center gap-1 border-2 border-dashed border-gray-300 cursor-pointer rounded-lg hover:shadow-md hover:scale-105 transition-transform">
                        <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-gray-600"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 5v14m-7-7h14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium text-gray-700 leading-tight text-center line-clamp-2">
                            Editar atalhos
                        </span>
                    </Card>
                </div>
            </div>
        </div>
    );
}
