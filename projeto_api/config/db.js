import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuração da conexão
// O Render usa a variável 'DATABASE_URL'.
// Se não estiver no Render, usaremos as variáveis locais do .env
const config = {
  connectionString: process.env.DATABASE_URL,
  // Se não houver DATABASE_URL, monta a config local
  ...(process.env.DATABASE_URL
    ? {
        ssl: {
          rejectUnauthorized: false, // Necessário para o Render
        },
      }
    : {
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT,
      }),
};

// Se DATABASE_URL existir (no Render), adiciona o SSL.
if (config.connectionString) {
  config.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(config);

// Exportamos uma função de consulta que os models usarão
export const query = (text, params) => pool.query(text, params);