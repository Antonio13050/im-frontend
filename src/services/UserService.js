import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api";

export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Nenhum token encontrado no localStorage");
        }

        const response = await axios.get(`${API_BASE_URL}/users`, {
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
        return null;
    }
};

export const createUser = async (data) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Nenhum token encontrado no localStorage");
        }
        const response = await axios.post(`${API_BASE_URL}/users`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro em createUser:", error);
        throw new Error(
            `Erro ao criar usuário: ${
                error.response?.data?.message || error.message
            }`
        );
    }
};

export const updateUser = async (userId, data) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Nenhum token encontrado no localStorage");
        }
        const response = await axios.put(
            `${API_BASE_URL}/users/${userId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erro em updateUser:", error);
        throw new Error(
            `Erro ao atualizar usuário: ${
                error.response?.data?.message || error.message
            }`
        );
    }
};
