import { useState, useEffect } from "react";
import { fetchClientes } from "@/services/ClienteService";
import { fetchImoveis } from "@/services/ImovelService";
import { toast } from "sonner";

export default function useClientesData(user) {
    const [allClientes, setAllClientes] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadData();
        } else {
            setIsLoading(false);
            setAllClientes([]);
            setImoveis([]);
        }
    }, [user]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allClientesData, imoveisData] = await Promise.all([
                fetchClientes(),
                fetchImoveis(),
            ]);
            setAllClientes(allClientesData ?? []);
            setImoveis(imoveisData ?? []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setAllClientes([]);
            setImoveis([]);
            toast.error(`Erro ao carregar dados: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return { allClientes, imoveis, isLoading, reload: loadData };
}
