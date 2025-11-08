import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    FileText,
    Home,
    MapPin,
    Menu,
    X,
    LogOut,
    User as UserIcon,
    BookCheck,
    Calendar,
    CalendarDays,
    Bell,
    Settings,
    HelpCircle,
    Globe,
    Mail,
    MessageSquare,
    Grid3x3,
    Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Layout() {
    const location = useLocation();
    const isMobile = useIsMobile();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuExpanded, setMenuExpanded] = useState(false);
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isMobile && sidebarOpen) {
            setMenuExpanded(true);
        }
    }, [isMobile, sidebarOpen]);

    const logout = async () => {
        handleLogout();
        navigate("/login");
    };

    const navigationItems = [
        {
            title: "Dashboard",
            url: "dashboard",
            icon: LayoutDashboard,
            allowedRoles: ["ADMIN", "GERENTE", "CORRETOR"],
        },
        {
            title: "Imóveis",
            url: "imoveis",
            icon: Home,
            allowedRoles: ["ADMIN", "GERENTE", "CORRETOR"],
        },
        {
            title: "Clientes",
            url: "clientes",
            icon: Users,
            allowedRoles: ["ADMIN", "GERENTE", "CORRETOR"],
        },
        {
            title: "Corretores",
            url: "corretores",
            icon: UserIcon,
            allowedRoles: ["ADMIN", "GERENTE"],
        },
        {
            title: "Mapa",
            url: "mapa",
            icon: MapPin,
            allowedRoles: ["ADMIN", "GERENTE", "CORRETOR"],
        },
        {
            title: "Relatório",
            url: "relatorio-admin",
            icon: BookCheck,
            allowedRoles: ["ADMIN"],
        },
        {
            title: "Imobiliária",
            url: "imobiliaria",
            icon: Building2,
            allowedRoles: ["ADMIN"],
        },
        {
            title: "Processos",
            url: "processos",
            icon: FileText,
            allowedRoles: ["ADMIN"],
        },
        {
            title: "Visitas",
            url: "visitas",
            icon: Calendar,
            allowedRoles: ["ADMIN"],
        },
        {
            title: "Agenda",
            url: "agenda",
            icon: CalendarDays,
            allowedRoles: ["ADMIN"],
        },
    ];

    const filteredNavigation = navigationItems.filter(
        (item) => !user?.scope || item.allowedRoles.includes(user.scope)
    );

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    const currentDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
    });

    const handleLinkClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const toggleMenu = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setMenuExpanded(!menuExpanded);
        }
    };

    const getCurrentPageTitle = () => {
        const currentPath = location.pathname;
        const currentItem = filteredNavigation.find(
            (item) =>
                currentPath === `/${item.url}` ||
                (item.url === "dashboard" &&
                    (currentPath === "/" || currentPath === "/dashboard"))
        );
        return currentItem ? currentItem.title : "Dashboard";
    };

    return (
        <div className="min-h-screen flex w-full bg-gray-50">
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/25 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 bg-[#1a1a1a] flex flex-col py-4 transition-all duration-500 ease-in-out
    ${
        isMobile
            ? sidebarOpen
                ? "translate-x-0 w-72"
                : "-translate-x-full w-72"
            : menuExpanded
            ? "w-72"
            : "w-16"
    }`}
            >
                {/* Logo / Título */}
                <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="mb-6 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>

                    <span
                        className={`text-white font-semibold text-lg transition-all duration-300 overflow-hidden
      ${
          isMobile || menuExpanded
              ? "opacity-100 ml-2 w-auto"
              : "opacity-0 ml-0 w-0"
      }
    `}
                        style={{ transitionProperty: "opacity, width, margin" }}
                    >
                        ImobiManager
                    </span>
                </Link>

                {/* Menu de navegação */}
                <nav className="flex-1 flex flex-col gap-2 w-full px-2">
                    {filteredNavigation.map((item) => {
                        const isActive =
                            location.pathname === `/${item.url}` ||
                            (item.url === "dashboard" &&
                                (location.pathname === "/" ||
                                    location.pathname === "/dashboard"));

                        return (
                            <Link
                                key={item.title}
                                to={
                                    item.url === "dashboard"
                                        ? "/dashboard"
                                        : `/${item.url}`
                                }
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300
            ${
                isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
                                title={
                                    !isMobile && !menuExpanded
                                        ? item.title
                                        : undefined
                                }
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />

                                <span
                                    className={`text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${
                                        isMobile || menuExpanded
                                            ? "opacity-100 ml-2"
                                            : "opacity-0 ml-0 w-0"
                                    }`}
                                >
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Rodapé da sidebar */}
                <div className="flex flex-col gap-2 w-full px-2 border-t border-gray-700 pt-4">
                    <button
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300"
                        title={
                            !isMobile && !menuExpanded
                                ? "Notificações"
                                : undefined
                        }
                    >
                        <Bell className="w-5 h-5 flex-shrink-0" />
                        <span
                            className={`text-sm font-medium transition-all duration-300 overflow-hidden ${
                                isMobile || menuExpanded
                                    ? "opacity-100 ml-2"
                                    : "opacity-0 ml-0 w-0"
                            }`}
                        >
                            Notificações
                        </span>
                    </button>

                    <button
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300"
                        title={!isMobile && !menuExpanded ? "Ajuda" : undefined}
                    >
                        <HelpCircle className="w-5 h-5 flex-shrink-0" />
                        <span
                            className={`text-sm font-medium transition-all duration-300 overflow-hidden ${
                                isMobile || menuExpanded
                                    ? "opacity-100 ml-2"
                                    : "opacity-0 ml-0 w-0"
                            }`}
                        >
                            Ajuda
                        </span>
                    </button>

                    <button
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300"
                        title={
                            !isMobile && !menuExpanded
                                ? "Configurações"
                                : undefined
                        }
                    >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span
                            className={`text-sm font-medium transition-all duration-300 overflow-hidden ${
                                isMobile || menuExpanded
                                    ? "opacity-100 ml-2"
                                    : "opacity-0 ml-0 w-0"
                            }`}
                        >
                            Configurações
                        </span>
                    </button>

                    {user && (
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-red-900 hover:text-red-400 transition-all duration-300"
                            title={
                                !isMobile && !menuExpanded ? "Sair" : undefined
                            }
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <span
                                className={`text-sm font-medium transition-all duration-300 overflow-hidden ${
                                    isMobile || menuExpanded
                                        ? "opacity-100 ml-2"
                                        : "opacity-0 ml-0 w-0"
                                }`}
                            >
                                Sair
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                    isMobile ? "ml-0" : menuExpanded ? "ml-72" : "ml-16"
                }`}
            >
                {/* Header Superior */}
                <header className="bg-white border-b border-gray-200 px-5 py-4">
                    <div className="flex items-center justify-between">
                        {/* Lado esquerdo - Ícone de menu e título da página */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleMenu}
                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                title={
                                    isMobile
                                        ? sidebarOpen
                                            ? "Fechar menu"
                                            : "Abrir menu"
                                        : menuExpanded
                                        ? "Recolher menu"
                                        : "Expandir menu"
                                }
                            >
                                {isMobile && sidebarOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </Button>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                {getCurrentPageTitle()}
                            </h1>
                        </div>

                        {/* Lado direito - Saudação, data e ícones de ação */}
                        <div className="flex items-center gap-6">
                            {/* Saudação e data - visível apenas em telas médias/grandes */}
                            <div className="hidden lg:block text-right">
                                <p className="text-sm text-gray-600 capitalize">
                                    {getGreeting()},{" "}
                                    {user?.nome?.split(" ")[0] || "Usuário"}!
                                </p>
                                <p
                                    className="text-xs text-gray-500
                                "
                                >
                                    {currentDate}
                                </p>
                            </div>

                            {/* Ícones de ação */}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    title="Notificações"
                                >
                                    <Bell className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    title="Aplicativos"
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    title="Presentes"
                                >
                                    <Gift className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    title="Configurações"
                                >
                                    <Settings className="w-5 h-5" />
                                </Button>
                                {/* Avatar do usuário */}
                                {user && (
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user.nome?.charAt(0).toUpperCase() ||
                                            "U"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Área de conteúdo */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
