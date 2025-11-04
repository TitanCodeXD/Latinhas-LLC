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

// iniciando servid
const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log('Servidor rodando na porta 3030 🚀💥💥');
});

/* 1 - Criar/Cadastrar Demanda - POST */
//To-do

/* 2 - Listar todas demandas - GET */
//To-do

/* 3 - Editar demandas by ID - PUT */
//To-do

/* 4 - Deletar demanda by ID - Delete */
//To-do

/* Extras: Talvez adicionar, apenas para uma API mais 'robusta' e para facilitar nos meus teste 
quando eu for checar nos insomnia, creio que ajude*/
/* 5 - Buscar demanda by ID - GET */
/* 6 - ? */
