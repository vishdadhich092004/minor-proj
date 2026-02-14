import axios from 'axios';

// Backend base URL from Flutter constants.dart
const MAIN_URL = import.meta.env.DEV ? 'http://localhost:7070' : 'https://minor-proj-tau.vercel.app'


const api = axios.create({
    baseURL: MAIN_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for attaching auth token (placeholder for now)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
