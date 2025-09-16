import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/clientes";

export const fetchClientes = async () => {
    const response = await axios.get(API_BASE_URL, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

export const createCliente = async (cliente) => {
    const response = await axios.post(API_BASE_URL, cliente, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

export const updateCliente = async (cliente) => {
    const response = await axios.put(`${API_BASE_URL}/${cliente.id}`, cliente, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

export const deleteCliente = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};
