//So para eu centralizar a api, vai ficar mais fácil com ela centralizada aqui
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3030/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllPeriods = async () => {
    const response = await api.get('/periods');
    return response.data;
};

export default api;
