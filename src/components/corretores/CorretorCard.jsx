import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Edit, UserCheck, UserX } from "lucide-react";
import { usePerfilConfig } from "@/hooks/usePerfilConfig";

const CorretorCard = ({ corretor, onEdit, onToggleStatus }) => {
    const perfil = corretor.roles[0].nome;
    const { icon, color, label } = usePerfilConfig(perfil);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                                {corretor.nome || corretor.email}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className={color}>{label}</Badge>
                                <Badge
                                    variant={
                                        corretor.ativo ? "default" : "secondary"
                                    }
                                    className={
                                        corretor.ativo
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                    }
                                >
                                    {corretor.ativo ? "Ativo" : "Inativo"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{corretor.email}</span>
                    </div>

                    {corretor.telefone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{corretor.telefone}</span>
                        </div>
                    )}

                    {corretor.creci && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">CRECI:</span>{" "}
                            {corretor.creci}
                        </div>
                    )}
                </div>

                <div className="pt-3 border-t flex justify-between items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(corretor)}
                        className="flex items-center gap-1"
                        aria-label="Editar corretor"
                    >
                        <Edit className="w-3 h-3" />
                        Editar
                    </Button>

                    <Button
                        variant={corretor.ativo ? "destructive" : "default"}
                        size="sm"
                        onClick={() => onToggleStatus(corretor)}
                        className="flex items-center gap-1"
                        aria-label={
                            corretor.ativo
                                ? "Desativar corretor"
                                : "Ativar corretor"
                        }
                    >
                        {corretor.ativo ? (
                            <>
                                <UserX className="w-3 h-3" />
                                Desativar
                            </>
                        ) : (
                            <>
                                <UserCheck className="w-3 h-3" />
                                Ativar
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(CorretorCard);
