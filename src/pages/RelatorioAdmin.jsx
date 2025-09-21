import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    AlertTriangle,
    ChevronDown,
    Home,
    Users,
    ShieldAlert,
    Frown,
    Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { useAuth } from "@/contexts/AuthContext";

const DataHealthCard = ({ title, count, icon: Icon, color }) => (
    <Card className={`border-l-4 ${color}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground">
                {count > 0 ? "Requer atenção" : "Tudo certo!"}
            </p>
        </CardContent>
    </Card>
);

export default function RelatorioAdmin() {
    const { user, isLoading: authLoading } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dataHealth, setDataHealth] = useState(null);
    const [teamStructure, setTeamStructure] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) {
            return; // Wait for auth to initialize
        }

        if (!user) {
            setError("Usuário não autenticado");
            setIsLoading(false);
            navigate("/login");
            return;
        }

        const loadData = async () => {
            setIsLoading(true);
            try {
                setCurrentUser(user);
                const [allUsers, allClientes, allImoveis] = await Promise.all([
                    fetchUsers(),
                    fetchClientes(),
                    fetchImoveis(),
                ]);

                const corretoresSemGerente = allUsers.filter(
                    (u) => u.roles[0].nome === "CORRETOR" && !u.gerenteId
                );
                const clientesSemCorretor = allClientes.filter(
                    (c) => !c.corretorId
                );
                const imoveisSemCorretor = allImoveis.filter(
                    (i) => !i.corretorId
                );

                setDataHealth({
                    corretoresSemGerente,
                    clientesSemCorretor,
                    imoveisSemCorretor,
                });

                // Process Team Structure
                const gerentes = allUsers.filter(
                    (u) => u.roles[0].nome === "GERENTE"
                );
                const corretores = allUsers.filter(
                    (u) => u.roles[0].nome === "CORRETOR"
                );

                const corretoresByGerente = _.groupBy(corretores, "gerenteId");

                const structure = gerentes.map((gerente) => {
                    const equipe = corretoresByGerente[gerente.userId] || [];
                    return {
                        gerente,
                        equipe: equipe.map((corretor) => ({
                            corretor,
                            clientes: allClientes.filter(
                                (c) => c.corretorId === corretor.userId
                            ),
                            imoveis: allImoveis.filter(
                                (i) => i.corretorId === corretor.userId
                            ),
                        })),
                    };
                });

                // Add brokers without a manager
                const semGerente =
                    corretoresByGerente["null"] ||
                    corretoresByGerente["undefined"] ||
                    [];
                if (semGerente.length > 0) {
                    structure.push({
                        gerente: {
                            nome: "Corretores Sem Gerente",
                            userId: "none",
                        },
                        equipe: semGerente.map((corretor) => ({
                            corretor,
                            clientes: allClientes.filter(
                                (c) => c.corretorId === corretor.userId
                            ),
                            imoveis: allImoveis.filter(
                                (i) => i.corretorId === corretor.userId
                            ),
                        })),
                    });
                }

                setTeamStructure(structure);
            } catch (error) {
                console.error("Erro ao carregar relatório:", error);
                if (error.response?.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    navigate("/login");
                } else {
                    setError("Erro ao carregar os dados do relatório");
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-600">{error}</h2>
                <p className="text-gray-500">
                    Tente novamente ou contate o suporte.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (currentUser?.scope !== "ADMIN") {
        return (
            <div className="p-8 text-center">
                <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Acesso Negado</h2>
                <p className="text-gray-600">
                    Esta página é exclusiva para administradores.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Relatório Administrativo
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Visão geral da saúde dos dados e estrutura da equipe.
                    </p>
                </div>

                {/* Data Health Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">
                        Saúde dos Dados
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <DataHealthCard
                            title="Corretores Sem Gerente"
                            count={dataHealth?.corretoresSemGerente.length || 0}
                            icon={Frown}
                            color="border-orange-500"
                        />
                        <DataHealthCard
                            title="Clientes Sem Corretor"
                            count={dataHealth?.clientesSemCorretor.length || 0}
                            icon={Users}
                            color="border-yellow-500"
                        />
                        <DataHealthCard
                            title="Imóveis Sem Corretor"
                            count={dataHealth?.imoveisSemCorretor.length || 0}
                            icon={Building}
                            color="border-red-500"
                        />
                    </div>
                </section>

                {/* Team Structure Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">
                        Estrutura de Equipes e Portfólios
                    </h2>
                    <div className="space-y-4">
                        {teamStructure.map(({ gerente, equipe }) => (
                            <Card key={gerente.userId}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {gerente.userId === "none" ? (
                                            <span className="flex items-center gap-2 text-orange-600">
                                                <AlertTriangle className="w-5 h-5" />
                                                {gerente.nome}
                                            </span>
                                        ) : (
                                            `Gerente: ${gerente.nome}`
                                        )}
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            {equipe.length} corretor(es)
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {equipe.length > 0 ? (
                                        equipe.map(
                                            ({
                                                corretor,
                                                clientes,
                                                imoveis,
                                            }) => (
                                                <Collapsible
                                                    key={corretor.userId}
                                                    className="border rounded-lg p-4"
                                                >
                                                    <CollapsibleTrigger className="w-full flex justify-between items-center">
                                                        <div className="text-left">
                                                            <p className="font-medium">
                                                                {corretor.nome}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {corretor.email}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm flex items-center gap-1">
                                                                <Users className="w-4 h-4" />{" "}
                                                                {
                                                                    clientes.length
                                                                }
                                                            </span>
                                                            <span className="text-sm flex items-center gap-1">
                                                                <Home className="w-4 h-4" />{" "}
                                                                {imoveis.length}
                                                            </span>
                                                            <ChevronDown className="h-4 w-4" />
                                                        </div>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="pt-4 mt-4 border-t">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Clientes
                                                                </h4>
                                                                {clientes.length >
                                                                0 ? (
                                                                    <ul className="list-disc list-inside text-sm space-y-1">
                                                                        {clientes.map(
                                                                            (
                                                                                c
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        c.id
                                                                                    }
                                                                                >
                                                                                    <Link
                                                                                        to={`/cliente-detalhes/${c.id}`}
                                                                                        className="text-blue-600 hover:underline"
                                                                                    >
                                                                                        {
                                                                                            c.nome
                                                                                        }
                                                                                    </Link>
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500">
                                                                        Nenhum
                                                                        cliente.
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Imóveis
                                                                </h4>
                                                                {imoveis.length >
                                                                0 ? (
                                                                    <ul className="list-disc list-inside text-sm space-y-1">
                                                                        {imoveis.map(
                                                                            (
                                                                                i
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        i.id
                                                                                    }
                                                                                >
                                                                                    <Link
                                                                                        to={`/imovel-detalhes/${i.id}`}
                                                                                        className="text-blue-600 hover:underline"
                                                                                    >
                                                                                        {
                                                                                            i.titulo
                                                                                        }
                                                                                    </Link>
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500">
                                                                        Nenhum
                                                                        imóvel.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            )
                                        )
                                    ) : (
                                        <p className="text-sm text-gray-500 pl-4">
                                            Nenhum corretor nesta equipe.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
