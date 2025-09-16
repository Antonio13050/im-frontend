import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/geocode";

export const getCoordinates = async (endereco) => {
    try {
        const response = await axios.get(API_BASE_URL, {
            params: { endereco },
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Erro na API de geocoding:", error);
        throw error;
    }
};
