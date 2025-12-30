import api from "@/services/api";

const BASE_PATH = "/geocode";

export const getCoordinates = async (endereco) => {
    try {
        const response = await api.get(BASE_PATH, {
            params: { endereco },
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Erro na API de geocoding:", error);
        throw error;
    }
};
