import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    Home,
    MapPin,
    Menu,
    X,
    LogOut,
    User as UserIcon,
    OutdentIcon,
    BookCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";

export default function Layout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

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
    ];

    const filteredNavigation = navigationItems.filter(
        (item) => !user?.scope || item.allowedRoles.includes(user.scope)
    );

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen flex w-full bg-gray-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        ImobiManager
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Gestão Imobiliária
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
                                Navegação
                            </p>
                            {filteredNavigation.map((item) => (
                                <Link
                                    key={item.title}
                                    to={item.url}
                                    onClick={handleLinkClick}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 ${
                                        location.pathname === `/${item.url}`
                                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                                            : "text-gray-700"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* Footer */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm truncate">
                                        {user?.full_name || user?.email}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate capitalize">
                                        {user?.perfil || "Corretor"}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={logout}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                <header className="bg-white border-b border-gray-200 px-6 py-4 lg:hidden">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900">
                            ImobiManager
                        </h1>
                    </div>
                </header>
                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
