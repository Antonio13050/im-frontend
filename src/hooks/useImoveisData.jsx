import { useState, useEffect } from "react";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { toast } from "sonner";

export default function useImoveisData(user) {
    const [allImoveis, setAllImoveis] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [corretores, setCorretores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setIsLoading(false);
            setAllImoveis([]);
            setClientes([]);
            setCorretores([]);
        }
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allImoveisData, allClientesData, allUsersData] =
                await Promise.all([
                    fetchImoveis(),
                    fetchClientes(),
                    fetchUsers(),
                ]);
            setAllImoveis(allImoveisData ?? []);
            setClientes(allClientesData ?? []);
            setCorretores(allUsersData ?? []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setAllImoveis([]);
            setClientes([]);
            setCorretores([]);
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return { allImoveis, clientes, corretores, isLoading, reload: loadData };
}
