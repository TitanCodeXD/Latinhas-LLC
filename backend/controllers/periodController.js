import { PrismaClient } from '@prisma/client';
import { recalcularPeriodo } from '../utils/statusHelper.js';
const prisma = new PrismaClient();

//  Listar todos os períodos com suas demandas, vou usar na tela inicial para ja começar exibindo as demandas em um periodo
export const getAllPeriods = async (req, res) => {
    try {
        const periods = await prisma.periodo.findMany({
            include: {
                demands: true, // inclui as demandas de cada período
            },
            orderBy: {
                id: 'desc',
            },
        });

        // Calcular totalPlan e totalProd para cada período
        const formatted = periods.map((period) => {
            const totalPlan = period.demands.reduce((sum, d) => sum + d.totalPlan, 0);
            const totalProd = period.demands.reduce((sum, d) => sum + d.totalProd, 0);

            return {
                ...period,
                totalPlan,
                totalProd,
            };
        });

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar períodos.' });
    }
};

// Criar novo período
export const createPeriod = async (req, res) => {
    try {
        const { startDate, endDate, demands } = req.body;

        // Calcula o total de planejamento com base nas demandas
        const totalPlan = demands.reduce((acc, d) => acc + (d.totalPlan || 0), 0);

        const period = await prisma.periodo.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPlan,
                totalProd: 0,
                demands: {
                    create: demands?.map((d) => ({
                        sku: d.sku,
                        description: d.description,
                        totalPlan: d.totalPlan,
                        totalProd: d.totalProd || 0,
                    })),
                },
            },
            include: { demands: true },
        });

        res.status(201).json(period);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar período.' });
    }
};

// Buscar um período por ID PARA TESTES
export const getPeriodById = async (req, res) => {
    try {
        const { id } = req.params;

        const period = await prisma.periodo.findUnique({
            where: { id: Number(id) },
            include: { demands: true },
        });

        if (!period) {
            return res.status(404).json({ error: 'Período não encontrado.' });
        }

        res.status(200).json(period);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar período.' });
    }
};
// ^^ PARA TESTES

// Atualizar status de um período DEPRECIADO
export const updatePeriodStatus = async (req, res) => {
    try {
        const id = Number(req.params.id); // id do período
        const { status } = req.body;

        if (!['PLANEJAMENTO', 'EM_ANDAMENTO', 'CONCLUIDO'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        const updatedPeriod = await prisma.periodo.update({
            where: { id },
            data: { status },
        });

        return res.status(200).json(updatedPeriod);
    } catch (error) {
        console.error('Erro ao atualizar status do período:', error);
        return res.status(500).json({ error: 'Erro ao atualizar status do período' });
    }
};
// ^^ DEPRECIADO

//Editar uma demanda existente
export const editDemand = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { description, totalPlan, totalProd } = req.body;

        const updatedDemand = await prisma.demand.update({
            where: { id },
            data: {
                ...(description !== undefined && { description }),
                ...(totalPlan !== undefined && { totalPlan }),
                ...(totalProd !== undefined && { totalProd }),
            },
        });

        // Aqui vou me preocupar em sempre atualizar o status conforme a demanda é atualizada
        //vou pegar o periodo ao qual ela esta relacionada, para depois comparar o totalPlan e totalProd

        // Recalcula o período usando a função auxiliar no util, para ficar mais compacto aqui
        await recalcularPeriodo(updatedDemand.periodoId, prisma);

        return res.status(200).json(updatedDemand);
    } catch (error) {
        console.error('Erro ao editar demanda:', error);
        return res.status(500).json({ error: 'Erro ao editar demanda' });
    }
};

// Excluir uma demanda de um período
export const deleteDemandFromPeriod = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Busca a demanda antes de deletar para pegar o periodoId
        const demand = await prisma.demand.findUnique({
            where: { id },
        });

        if (!demand) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }

        const periodoId = demand.periodoId;

        // Deleta a demanda
        await prisma.demand.delete({
            where: { id },
        });

        // Recalcula o período (totais e status)
        await recalcularPeriodo(periodoId, prisma);

        return res.status(200).json({ message: 'Demanda deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar demanda:', error);
        return res.status(500).json({ error: 'Erro ao deletar demanda' });
    }
};

// ↓ PARA TESTES APENAS ↓
// Excluir um período completo pelo ID
export const deletePeriod = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Verificar se o período existe
        const period = await prisma.periodo.findUnique({ where: { id } });
        if (!period) return res.status(404).json({ error: 'Período não encontrado.' });

        // Deletar o período e todas as demandas relacionadas (cascade)
        await prisma.periodo.delete({ where: { id } });

        res.status(200).json({ message: 'Período removido com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover período.' });
    }
};
// ^^ PARA TESTES APENAS ^^
