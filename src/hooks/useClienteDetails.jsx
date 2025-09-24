import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { fetchImoveis } from "@/services/ImovelService";

export const useClienteDetails = (id) => {
    const [cliente, setCliente] = useState(null);
    const [corretor, setCorretor] = useState(null);
    const [imoveisVinculados, setImoveisVinculados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [allClientes, allUsers, allImoveis] = await Promise.all([
                fetchClientes(),
                fetchUsers(),
                fetchImoveis(),
            ]);

            const clienteData = allClientes.find((c) => c.id == id);
            if (!clienteData) {
                throw new Error("Cliente não encontrado");
            }

            setCliente(clienteData);

            const corretorData = clienteData.corretorId
                ? allUsers.find((u) => u.userId === clienteData.corretorId)
                : null;
            setCorretor(corretorData);

            const imoveisData = allImoveis.filter((i) => i.clienteId === id);
            setImoveisVinculados(imoveisData);
        } catch (err) {
            setError(err.message);
            if (err.response?.status === 401) navigate("/login");
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) loadData();
    }, [id, loadData]);

    return { cliente, corretor, imoveisVinculados, loading, error };
};
