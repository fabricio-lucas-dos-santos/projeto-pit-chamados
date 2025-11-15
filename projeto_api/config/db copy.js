import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Cria um "pool" de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função de consulta helper
async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

export default query;