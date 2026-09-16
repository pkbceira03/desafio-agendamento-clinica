import express from 'express';
import { prisma } from './database';

const app = express();
const port = process.env.PORT || 3000;

app.get('/test-db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ 
      success: true, 
      message: 'Conexão com o Prisma bem-sucedida!', 
      databaseTime: result 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro ao conectar no banco via Prisma' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});