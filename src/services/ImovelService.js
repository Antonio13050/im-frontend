import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/imoveis";

export const fetchImovelById = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar imóvel com ID ${id}:`, error);
        throw error;
    }
};

export const fetchImoveis = async (params = {}, signal = null) => {
    const token = localStorage.getItem("token");
    try {
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
        }
        return null;
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
        console.error("Erro ao buscar imóveis:", error);
        throw error;
    }
};

export const createImovel = async (formData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(API_BASE_URL, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar imóvel:", error);
        throw error;
    }
};

export const updateImovel = async (formData, id) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar imóvel:", error);
        throw error;
    }
};

export const deleteImovel = async (id) => {
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
        console.error("Erro ao deletar imóvel:", error);
        throw error;
    }
};
