import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/visitas";

export const fetchVisitas = async () => {
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
        console.error("Erro ao buscar visitas:", error.response || error);
        return null;
    }
};
export const createVisita = async (visitData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(API_BASE_URL, visitData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar visita:", error.response || error);
        throw error;
    }
};

export async function updateStatusVisita(visitaId, newStatus) {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${visitaId}/status`,
            { status: newStatus },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar status:", error.response || error);
        throw error;
    }
}

export const updateVisita = async (id, data) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar visita:", error.response || error);
        throw error;
    }
};

export const deleteVisita = async (id) => {
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
        console.error("Erro ao deletar visita:", error.response || error);
        throw error;
    }
};
