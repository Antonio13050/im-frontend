import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";

export const useAdminData = () => {
    const [dataHealth, setDataHealth] = useState(null);
    const [teamStructure, setTeamStructure] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
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
            const imoveisSemCorretor = allImoveis.filter((i) => !i.corretorId);

            setDataHealth({
                corretoresSemGerente,
                clientesSemCorretor,
                imoveisSemCorretor,
            });

            const gerentes = allUsers.filter(
                (u) => u.roles[0].nome === "GERENTE"
            );
            const corretores = allUsers.filter(
                (u) => u.roles[0].nome === "CORRETOR"
            );
            const corretoresByGerente = _.groupBy(corretores, "gerenteId");

            const structure = gerentes.map((gerente) => ({
                gerente,
                equipe: (corretoresByGerente[gerente.userId] || []).map(
                    (corretor) => ({
                        corretor,
                        clientes: allClientes.filter(
                            (c) => c.corretorId === corretor.userId
                        ),
                        imoveis: allImoveis.filter(
                            (i) => i.corretorId === corretor.userId
                        ),
                    })
                ),
            }));

            const semGerente =
                corretoresByGerente["null"] ||
                corretoresByGerente["undefined"] ||
                [];
            if (semGerente.length > 0) {
                structure.push({
                    gerente: { nome: "Corretores Sem Gerente", userId: "none" },
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
        } catch (err) {
            setError(err.message);
            if (err.response?.status === 401) navigate("/login");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { dataHealth, teamStructure, loading, error };
};
