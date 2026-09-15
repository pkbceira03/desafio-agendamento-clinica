import express from 'express';
import { pool } from './database';

const app = express();
const port = process.env.PORT || 3000;

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Conexão com o banco de dados bem-sucedida!', 
      databaseTime: result.rows[0].now 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erro ao conectar no banco' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});