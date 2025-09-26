import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/processo-status-history";

export async function fetchHistory(processoId) {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(
            `${API_BASE_URL}/processo/${processoId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
