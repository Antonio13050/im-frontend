import api from "@/services/api";

const BASE_PATH = "/clientes";

export const fetchClientes = async (params = {}, signal = null) => {
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
        console.error("Erro ao buscar clientes:", error.response || error);
        throw error;
    }
};

export const fetchClienteById = async (id) => {
    try {
        const response = await api.get(`${BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar cliente com ID ${id}:`, error);
        throw error;
    }
};

export const fetchClientesPaginated = async (page = 0, size = 10) => {
    try {
        const response = await api.get(`${BASE_PATH}/paginated`, {
            params: { page, size },
        });
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar clientes:", error.response || error);
        return null;
    }
};

export const createCliente = async (formData) => {
    try {
        const isFormData = formData instanceof FormData;
        const response = await api.post(BASE_PATH, formData, {
            headers: {
                "Content-Type": isFormData ? "multipart/form-data" : "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar cliente:", error.response || error);
        throw error;
    }
};

export const updateCliente = async (formData, id) => {
    try {
        const isFormData = formData instanceof FormData;
        const clienteId = id || formData.id;

        const response = await api.put(`${BASE_PATH}/${clienteId}`, formData, {
            headers: {
                "Content-Type": isFormData ? "multipart/form-data" : "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error.response || error);
        throw error;
    }
};

export const deleteCliente = async (id) => {
    try {
        const response = await api.delete(`${BASE_PATH}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar cliente:", error.response || error);
        throw error;
    }
};
