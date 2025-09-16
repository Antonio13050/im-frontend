import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/imoveis";

export const fetchImoveis = async () => {
    const response = await axios.get(API_BASE_URL, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

export const createImovel = async (formData) => {
    const response = await axios.post(API_BASE_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateImovel = async (formData) => {
    const imovelJson = JSON.parse(await formData.get("imovel").text());
    const response = await axios.put(
        `${API_BASE_URL}/${imovelJson.id}`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return response.data;
};

export const deleteImovel = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};
