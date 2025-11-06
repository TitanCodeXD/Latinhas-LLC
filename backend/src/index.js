import express from 'express';

import cors from 'cors';
import periodRoutes from '../routes/periodRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

//Rota dos peeriods
app.use('/periods', periodRoutes);

//Rota de teste - para verificar tudo no insomnia
app.get('/', (req, res) => {
    res.send('Rota de teste concluída !! ✅');
});

// iniciando servid
const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log('Servidor rodando na porta 3030 🚀💥💥');
});
