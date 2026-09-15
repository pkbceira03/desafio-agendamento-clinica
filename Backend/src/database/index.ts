import { Pool } from 'pg';
import 'dotenv/config';

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.on('error', (err: Error) => {
  console.error('Erro inesperado no banco de dados', err);
  process.exit(-1);
});