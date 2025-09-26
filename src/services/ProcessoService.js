import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/processos";

export const fetchProcessos = async () => {
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
        console.error("Erro ao buscar processos:", error);
        return null;
    }
};

export const createProcesso = async (processo) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(API_BASE_URL, processo, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar processo:", error.response || error);
        throw error;
    }
};

export async function updateStatus(processId, newStatus, statusChangeNotes) {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.put(
            `${API_BASE_URL}/${processId}/status`,
            {
                status: newStatus,
                observacao: statusChangeNotes,
            },
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

export async function updateProcesso(id, data) {
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
        console.error("Erro ao atualizar processo:", error.response || error);
        throw error;
    }
}
