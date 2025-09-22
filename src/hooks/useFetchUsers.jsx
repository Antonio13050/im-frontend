import { useState, useEffect } from "react";
import { fetchUsers } from "@/services/UserService";

export const useFetchUsers = (user) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const usersData = await fetchUsers();
            setAllUsers(Array.isArray(usersData) ? usersData : []);
        } catch (err) {
            console.error("Erro ao carregar usuários:", err);
            setError(err.message);
            setAllUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            setError("Usuário não autenticado");
            setAllUsers([]);
            return;
        }

        loadData();
    }, [user]);

    const reload = () => loadData();

    return { allUsers, isLoading, error, reload };
};
