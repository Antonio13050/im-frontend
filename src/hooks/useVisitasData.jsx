import { useState, useEffect } from "react";
import { fetchVisitas } from "@/services/VisitaService";
import { fetchImoveis } from "@/services/ImovelService";
import { fetchClientes } from "@/services/ClienteService";
import { fetchUsers } from "@/services/UserService";
import { toast } from "sonner";

export default function useVisitasData(user) {
    const [visitas, setVisitas] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setIsLoading(false);
            setVisitas([]);
            setImoveis([]);
            setClientes([]);
            setUsers([]);
        }
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allVisitas, allImoveisData, allClientesData, AllUsers] =
                await Promise.all([
                    fetchVisitas(),
                    fetchImoveis(),
                    fetchClientes(),
                    fetchUsers(),
                ]);
            setVisitas(allVisitas ?? []);
            setImoveis(allImoveisData ?? []);
            setClientes(allClientesData ?? []);
            setUsers(AllUsers ?? []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setVisitas([]);
            setImoveis([]);
            setClientes([]);
            setUsers([]);
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        visitas,
        imoveis,
        clientes,
        users,
        isLoading,
        reload: loadData,
    };
}
