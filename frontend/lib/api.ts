//So para eu centralizar a api, vai ficar mais fácil com ela centralizada aqui
export const API_BASE_URL = 'http://localhost:3030';

export async function fetchDemands() {
    const res = await fetch(`${API_BASE_URL}/demands`);
    if (!res.ok) throw new Error('Erro ao buscar demandas');
    return res.json();
}

export async function createDemand(data: any) {
    const res = await fetch(`${API_BASE_URL}/demands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar demanda');
    return res.json();
}
