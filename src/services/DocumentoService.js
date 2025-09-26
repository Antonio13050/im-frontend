import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/documentos";

export const uploadDocument = async ({
    processId,
    documentName,
    documentType,
    file,
}) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("processId", processId);
    formData.append("documentName", documentName);
    formData.append("documentType", documentType);
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getDocumentsByProcessId = async (processId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/processo/${processId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const downloadDocument = async (documentId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${documentId}/download`, {
        responseType: "blob",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const deleteDocument = async (documentId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_BASE_URL}/${documentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
