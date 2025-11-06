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
    const response = await api.post('/periods', periodData);
    return response.data;
}

export async function updateDemand(id: string, data: { totalPlan?: number; totalProd?: number }) {
    const res = await api.patch(`/periods/demands/${id}`, data);
    return res.data;
}

export async function deleteDemand(id: string) {
    const res = await api.delete(`/periods/demands/${id}`);
    return res.data;
}

//opcional que quis fazer, para não acumular periodos
export async function deletePeriod(id: string) {
    const res = await api.delete(`/periods/${id}`);
    return res.data;
}

export default api;
