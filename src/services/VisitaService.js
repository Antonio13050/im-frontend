import api from "@/services/api";

const BASE_PATH = "/visitas";

export const fetchVisitas = async () => {
    try {
        const response = await api.get(BASE_PATH);

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
    try {
        const response = await api.post(BASE_PATH, visitData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar visita:", error.response || error);
        throw error;
    }
};

export async function updateStatusVisita(visitaId, newStatus) {
    try {
        const response = await api.put(
            `${BASE_PATH}/${visitaId}/status`,
            { status: newStatus }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar status:", error.response || error);
        throw error;
    }
}

export const updateVisita = async (id, data) => {
    try {
        const response = await api.put(`${BASE_PATH}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar visita:", error.response || error);
        throw error;
    }
};

export const deleteVisita = async (id) => {
    try {
        const response = await api.delete(`${BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar visita:", error.response || error);
        throw error;
    }
};
