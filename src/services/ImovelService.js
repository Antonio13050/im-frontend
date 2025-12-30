import api from "@/services/api";

const BASE_PATH = "/imoveis";

export const fetchImovelById = async (id) => {
    try {
        const response = await api.get(`${BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar imóvel com ID ${id}:`, error);
        throw error;
    }
};

export const fetchImoveis = async (params = {}, signal = null) => {
    try {
        const config = {};

        if (Object.keys(params).length > 0) {
            config.params = params;
        }

        if (signal) {
            config.signal = signal;
        }

        const response = await api.get(BASE_PATH, config);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }
        return null;
    } catch (error) {
        if (
            error.name === "AxiosError" &&
            (error.code === "ERR_CANCELED" || error.name === "CanceledError")
        ) {
            return null;
        }
        console.error("Erro ao buscar imóveis:", error);
        throw error;
    }
};

export const createImovel = async (formData) => {
    try {
        const response = await api.post(BASE_PATH, formData, {
            headers: {
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
    try {
        const response = await api.put(`${BASE_PATH}/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar imóvel:", error);
        throw error;
    }
};

export const deleteImovel = async (id) => {
    try {
        const response = await api.delete(`${BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar imóvel:", error);
        throw error;
    }
};
