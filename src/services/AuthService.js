import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api";

export const login = async (email, senha) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
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
        const response = await axios.post(
            `${API_BASE_URL}/register`,
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
