import api from "@/services/api";

const BASE_PATH = "/processo-status-history";

export async function fetchHistory(processoId) {
    try {
        const response = await api.get(
            `${BASE_PATH}/processo/${processoId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            "Erro ao buscar historico de processo:",
            error.response || error
        );
        throw error;
    }
}
