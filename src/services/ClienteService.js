import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/clientes";

export const fetchClientes = async (params = {}, signal = null) => {
    const token = localStorage.getItem("token");
    try {
        if (!token) {
            throw new Error("Nenhum token encontrado no localStorage");
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        // Adiciona parâmetros de query se fornecidos
        if (Object.keys(params).length > 0) {
            config.params = params;
        }

        // Adiciona AbortController signal se fornecido
        if (signal) {
            config.signal = signal;
        }

        const response = await axios.get(API_BASE_URL, config);

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        // Ignora erros de cancelamento
        if (
            axios.isCancel(error) ||
            error.name === "AbortError" ||
            error.name === "CanceledError" ||
            error.code === "ERR_CANCELED"
        ) {
            return null;
        }
        console.error("Erro ao buscar clientes:", error.response || error);
        throw error;
    }
};

export const fetchClienteById = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar cliente com ID ${id}:`, error);
        throw error;
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

export const createCliente = async (formData) => {
    const token = localStorage.getItem("token");
    try {
        // Verifica se é FormData ou objeto JSON
        const isFormData = formData instanceof FormData;
        const response = await axios.post(API_BASE_URL, formData, {
            headers: {
                "Content-Type": isFormData ? "multipart/form-data" : "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar cliente:", error.response || error);
        throw error;
    }
};

export const updateCliente = async (formData, id) => {
    const token = localStorage.getItem("token");
    try {
        // Verifica se é FormData ou objeto JSON
        const isFormData = formData instanceof FormData;
        // Se id não foi passado como parâmetro, tenta pegar do formData.id
        const clienteId = id || formData.id;
        const url = `${API_BASE_URL}/${clienteId}`;
        
        const response = await axios.put(url, formData, {
            headers: {
                "Content-Type": isFormData ? "multipart/form-data" : "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
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
