import { useState, useEffect } from "react";
import { fetchProcessos } from "@/services/ProcessoService";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { toast } from "sonner";

export default function useProcessosData(user) {
    const [allProcessos, setAllProcessos] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setIsLoading(false);
            setAllProcessos([]);
            setImoveis([]);
            setClientes([]);
            setUsers([]);
        }
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [
                allProcessosData,
                allImoveisData,
                allClientesData,
                AllUsers,
            ] = await Promise.all([
                fetchProcessos(),
                fetchImoveis(),
                fetchClientes(),
                fetchUsers(),
            ]);
            setAllProcessos(allProcessosData ?? []);
            setImoveis(allImoveisData ?? []);
            setClientes(allClientesData ?? []);
            setUsers(AllUsers ?? []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setAllProcessos([]);
            setImoveis([]);
            setClientes([]);
            setUsers([]);
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        allProcessos,
        imoveis,
        clientes,
        users,
        isLoading,
        reload: loadData,
    };
}
