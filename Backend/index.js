const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// Apenas para garantir que uma transição vá para a seguinte
const validTransitions = {
    PLANEJAMENTO: ['EM_ANDAMENTO'],
    EM_ANDAMENTO: ['CONCLUIDO'],
    CONCLUIDO: [],
};

function canTransition(current, next) {
    if (current === next)
        return true; /* para checar se esta válido, se o valor da chave for igual ao que esta 
sendo requerido para editar*/
    return validTransitions[current]?.includes(next);
}

//Rota de teste - verificar tudo no insomnia
app.get('/', (req, res) => {
    res.send('Rota de teste concluída !! ✅');
});

/* 1 - Criar/Cadastrar Demanda - POST */
app.post('/demands', async (req, res) => {
    try {
        const { sku, startDate, endDate, totalPlanned, status } = req.body;

        if (!sku || !startDate || !endDate || totalPlanned == null) {
            //todos obrigatórios
            return res
                .status(400)
                .json({ error: 'sku, startDate, endDate e totalPlanned são obrigatórios.' });
        }

        const created = await prisma.demand.create({
            data: {
                sku,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPlanned: Number(totalPlanned),
                status: status || undefined,
            },
        });

        res.status(201).json(created);
    } catch (err) {
        //Primeiro chegar se o erro é porqu ja digitei um SKU igual antes, invalidando a criação
        if (err.code === 'P2002') {
            // CONSTRAINT UNIQUE - Erro do prisma

            return res.status(409).json({ error: 'SKU já existente.' });
        }
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/* 2 - Listar todas demandas - GET */
app.get('/demands', async (req, res) => {
    //de forma decrescente na datar, para facilitar visualizar as mais rcentes
    const demands = await prisma.demand.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(demands);
});

/* 3 - Buscar demanda by ID(SKU) - GET */
app.get('/demands/sku/:sku', async (req, res) => {
    const { sku } = req.params;
    const demand = await prisma.demand.findUnique({ where: { sku } });
    if (!demand) return res.status(404).json({ error: 'Não encontrada.' });
    res.json(demand);
});

/* 4 - Editar demandas by ID - PUT */
app.put('/demands/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { sku, startDate, endDate, totalPlanned, status } = req.body;

        // Validar se existe a demanda realmente, para evitar erros
        const exist = await prisma.demand.findUnique({ where: { id } });
        if (!exist) return res.status(404).json({ error: 'Demanda não encontrada.' });

        // checar transição válida
        if (status && !canTransition(exist.status, status)) {
            return res
                .status(400)
                .json({ error: `Transição de status inválida: ${exist.status} -> ${status}` });
        }

        const updated = await prisma.demand.update({
            where: { id },
            data: {
                sku: sku ?? undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                totalPlanned: totalPlanned != null ? Number(totalPlanned) : undefined,
                status: status ?? undefined,
            },
        });

        res.json(updated);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'SKU já existente.' });
        }
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/* 5 - Deletar demanda by ID - Delete */
app.delete('/demands/:id', async (req, res) => {
    const id = Number(req.params.id);

    // Validar se existe a demanda realmente, para evitar erros
    const exist = await prisma.demand.findUnique({ where: { id } });
    if (!exist) return res.status(404).json({ error: 'Demanda não encontrada.' });

    try {
        await prisma.demand.delete({ where: { id } });
        res.json({ message: 'Demanda deletada comsucesso!', success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

// iniciando servid
const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log('Servidor rodando na porta 3030 🚀💥💥');
});

/* Extras: Talvez adicionar, apenas para uma API mais 'robusta' e para facilitar nos meus teste 
quando eu for checar nos insomnia, creio que ajude*/
/* 6 - Pesquisar demandas por STATUS */
