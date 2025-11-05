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

export async function addPeriod(periodData: any) {
    const res = await fetch('http://localhost:3030/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(periodData),
    });
    if (!res.ok) throw new Error('Erro ao criar período');
    return await res.json();
}

export default api;
