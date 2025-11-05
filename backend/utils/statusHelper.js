// Apenas para não colocar funções auxiliares no controller, tentar manter algo mais 'limpo',
//  se der algum problema eu sei onde fazer manutenção de forma fácil tambem
export function atualizarStatusDoPeriodo(periodo) {
    if (periodo.totalProd === 0) return 'PLANEJAMENTO';
    if (periodo.totalProd > 0 && periodo.totalProd < periodo.totalPlan) return 'EM_ANDAMENTO';
    if (periodo.totalProd >= periodo.totalPlan) return 'CONCLUIDO';
}
