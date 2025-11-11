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

export const fetchImoveis = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(API_BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        return null;
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
