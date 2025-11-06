import express from 'express';
import {
    getAllPeriods,
    createPeriod,
    deleteDemandFromPeriod,
    editDemand,
    updatePeriodStatus,
    getPeriodById,
    deletePeriod,
} from '../controllers/periodController.js';

const router = express.Router();

router.get('/', getAllPeriods);

router.post('/', createPeriod);

router.get('/:id', getPeriodById);

router.delete('/demands/:id', deleteDemandFromPeriod);

router.delete('/:id', deletePeriod); //apenas para testes internos

router.patch('/demands/:id', editDemand);

router.patch('/:id/status', updatePeriodStatus); //nem usei no fim das contas, criei com uma ideia,
//no frontend acabou me vindo ideias diferentes e modifiquei tanto o back quando o front

export default router;
