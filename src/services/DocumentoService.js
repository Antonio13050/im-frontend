import api from "@/services/api";

const BASE_PATH = "/documentos";

export const uploadDocument = async ({
    processId,
    documentName,
    documentType,
    file,
}) => {
    const formData = new FormData();
    formData.append("processId", processId);
    formData.append("documentName", documentName);
    formData.append("documentType", documentType);
    formData.append("file", file);

    const response = await api.post(`${BASE_PATH}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getDocumentsByProcessId = async (processId) => {
    const response = await api.get(`${BASE_PATH}/processo/${processId}`);
    return response.data;
};

export const downloadDocument = async (documentId) => {
    const response = await api.get(`${BASE_PATH}/${documentId}/download`, {
        responseType: "blob",
    });
    return response;
};

export const deleteDocument = async (documentId) => {
    const response = await api.delete(`${BASE_PATH}/${documentId}`);
    return response.data;
};
