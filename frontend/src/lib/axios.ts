import axios from 'axios';

export const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.PROD
        ? 'https://api.streamify.codewithxjohn.com'
        : 'http://localhost:5000');

export const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});
