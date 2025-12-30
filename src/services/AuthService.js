import api from "@/services/api";

const BASE_PATH = ""; // AuthService endpoints are directly on /api

export const login = async (email, senha) => {
    try {
        const response = await api.post(`${BASE_PATH}/login`, {
            email,
            senha,
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

export const register = async (registration) => {
    try {
        const response = await api.post(
            `${BASE_PATH}/register`,
            registration
        );
        return response;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.detail);
        } else {
            throw new Error(`User registration error : ${error.message}`);
        }
    }
};
