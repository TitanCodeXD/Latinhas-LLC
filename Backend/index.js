const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

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

// iniciando servid
const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log('Servidor rodando na porta 3030 🚀💥💥');
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
//To-do

/* 5 - Deletar demanda by ID - Delete */
//To-do

/* Extras: Talvez adicionar, apenas para uma API mais 'robusta' e para facilitar nos meus teste 
quando eu for checar nos insomnia, creio que ajude*/
/* 6 - ? */
