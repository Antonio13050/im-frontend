import api from "@/services/api";

const BASE_PATH = "/processos";

export const fetchProcessos = async () => {
    try {
        const response = await api.get(BASE_PATH);
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
    try {
        const response = await api.post(BASE_PATH, processo, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar processo:", error.response || error);
        throw error;
    }
};

export async function updateStatus(processId, newStatus, statusChangeNotes) {
    try {
        const response = await api.put(
            `${BASE_PATH}/${processId}/status`,
            {
                status: newStatus,
                observacao: statusChangeNotes,
            },
            {
                headers: {
                    "Content-Type": "application/json",
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
    try {
        const response = await api.put(`${BASE_PATH}/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar processo:", error.response || error);
        throw error;
    }
}
