import api from "@/services/api";

const BASE_PATH = "/users";

export const fetchUsers = async (signal = null) => {
    try {
        const config = {};

        if (signal) {
            config.signal = signal;
        }

        const response = await api.get(BASE_PATH, config);
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        if (
            error.name === "AxiosError" &&
            (error.code === "ERR_CANCELED" || error.name === "CanceledError")
        ) {
            return null;
        }
        return null;
    }
};

export const createUser = async (data) => {
    try {
        const response = await api.post(BASE_PATH, data);
        return response.data;
    } catch (error) {
        console.error("Erro em createUser:", error);
        throw new Error(
            `Erro ao criar usuário: ${error.response?.data?.message || error.message
            }`
        );
    }
};

export const updateUser = async (userId, data) => {
    try {
        const response = await api.put(`${BASE_PATH}/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error("Erro em updateUser:", error);
        throw new Error(
            `Erro ao atualizar usuário: ${error.response?.data?.message || error.message
            }`
        );
    }
};
