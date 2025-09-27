import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/clientes";

export const fetchClientes = async () => {
    const token = localStorage.getItem("token");
    try {
        if (!token) {
            throw new Error("Nenhum token encontrado no localStorage");
        }
        const response = await axios.get(API_BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar clientes:", error.response || error);
        return null;
    }
};

export const fetchClientesPaginated = async (page = 0, size = 10) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_BASE_URL}/paginated`, {
            params: { page, size },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar clientes:", error.response || error);
        return null;
    }
};

export const createCliente = async (cliente) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(API_BASE_URL, cliente, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar cliente:", error.response || error);
        throw error;
    }
};

export const updateCliente = async (cliente) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${cliente.id}`,
            cliente,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error.response || error);
        throw error;
    }
};

export const deleteCliente = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`${API_BASE_URL}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar cliente:", error.response || error);
        throw error;
    }
};
