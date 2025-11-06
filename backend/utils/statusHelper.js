// Apenas para não colocar funções auxiliares no controller, tentar manter algo mais 'limpo',
//  se der algum problema eu sei onde fazer manutenção de forma fácil tambem
// Função para recalcular totais e status do período
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Só essa função estava dando um bug específico, ent tive que criar outra auxiliar que recalcula após deletar tambem
// após deletar uma demanda o total plan se mantia de forma errada, agora ele atualiza sempre, para manter o status
// de forma correta
export function atualizarStatusDoPeriodo(periodo) {
    if (periodo.totalProd === 0) return 'PLANEJAMENTO';
    if (periodo.totalProd > 0 && periodo.totalProd < periodo.totalPlan) return 'EM_ANDAMENTO';
    if (periodo.totalProd >= periodo.totalPlan) return 'CONCLUIDO';
}

export async function recalcularPeriodo(periodoId, prisma) {
    const periodo = await prisma.periodo.findUnique({
        where: { id: periodoId },
    });

    if (!periodo) return;

    // recalcular
    const totais = await prisma.demand.aggregate({
        where: { periodoId: periodo.id },
        _sum: {
            totalPlan: true,
            totalProd: true,
        },
    });

    const totalPlanPeriodo = totais._sum.totalPlan || 0;
    const totalProdPeriodo = totais._sum.totalProd || 0;

    // Calcula o novo status usando a minha primeira função
    const novoStatus = atualizarStatusDoPeriodo({
        totalProd: totalProdPeriodo,
        totalPlan: totalPlanPeriodo,
    });

    // Atualizar o período com os novos totais e status, isso estava bugando antes, nao atualizando corretamente
    await prisma.periodo.update({
        where: { id: periodo.id },
        data: {
            totalPlan: totalPlanPeriodo,
            totalProd: totalProdPeriodo,
            status: novoStatus,
        },
    });
}
