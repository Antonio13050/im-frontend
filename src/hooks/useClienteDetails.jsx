import { useState, useEffect } from "react";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { fetchImoveis } from "@/services/ImovelService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function useClienteDetails(id) {
    const { user: currentUser } = useAuth();
    const [cliente, setCliente] = useState(null);
    const [usersMap, setUsersMap] = useState(new Map());
    const [imoveisVinculados, setImoveisVinculados] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadData();
        } else {
            setCliente(null);
            setUsersMap(new Map());
            setImoveisVinculados([]);
            setIsLoading(false);
        }
    }, [id]);

    const loadData = async () => {
        setIsLoading(true);
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

            const usersMapData = new Map(
                allUsers.map((u) => [Number(u.userId), u.nome])
            );
            if (currentUser) {
                usersMapData.set(Number(currentUser.sub), currentUser.nome);
            }
            setUsersMap(usersMapData);

            const imoveisData = allImoveis.filter((i) => i.clienteId == id);
            setImoveisVinculados(imoveisData);
        } catch (error) {
            console.error("Erro ao carregar detalhes do cliente:", error);
            setCliente(null);
            setUsersMap(new Map());
            setImoveisVinculados([]);
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        cliente,
        usersMap,
        imoveisVinculados,
        isLoading,
        reload: loadData,
    };
}
