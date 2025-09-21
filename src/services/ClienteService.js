import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/clientes";
const token = localStorage.getItem("token");
if (!token) {
    throw new Error("Nenhum token encontrado no localStorage");
}

export const fetchClientes = async () => {
    try {
        const response = await axios.get(API_BASE_URL, {
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

export const createCliente = async (cliente) => {
    const response = await axios.post(API_BASE_URL, cliente, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateCliente = async (cliente) => {
    const response = await axios.put(`${API_BASE_URL}/${cliente.id}`, cliente, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteCliente = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
