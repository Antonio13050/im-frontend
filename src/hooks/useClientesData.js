import { useState, useEffect } from "react";
import { fetchClientes } from "@/services/ClienteService";
import { fetchImoveis } from "@/services/ImovelService";
import { toast } from "sonner";

export default function useClientesData(user) {
    const [clientes, setClientes] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setIsLoading(false);
            setClientes([]);
            setImoveis([]);
        }
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [clientesData, imoveisData] = await Promise.all([
                fetchClientes(),
                fetchImoveis(),
            ]);
            setClientes(clientesData ?? []);
            setImoveis(imoveisData ?? []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setClientes([]);
            setImoveis([]);
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return { clientes, imoveis, isLoading, reload: loadData };
}
