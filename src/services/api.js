import axios from "axios";

/**
 * Instância centralizada do Axios com configuração base
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8082/api",
});

/**
 * Interceptor de Requisição
 * Adiciona o token JWT automaticamente em todas as requisições se existir
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Interceptor de Resposta
 * Trata erros globais como 401 (Não autorizado)
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Se der 401, limpa o token e redireciona (opcional, pode ser tratado no contexto)
            // localStorage.removeItem("token");
            // window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
