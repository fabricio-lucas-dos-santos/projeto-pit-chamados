import { query } from '../config/db.js';

// Modelo para buscar um usuário pelo e-mail
export async function buscarUsuarioPorEmail(email) {
  const sql = 'SELECT * FROM Usuario WHERE email = $1';
  const result = await query(sql, [email]);
  return result.rows[0]; // Retorna o primeiro usuário (ou undefined)
}

// Modelo para criar um novo usuário
export async function criarUsuario(nome, email, senhaHash, tipo) {
  const sql = `
    INSERT INTO Usuario (nome, email, senha_hash, tipo) 
    VALUES ($1, $2, $3, $4)
    RETURNING id_usuario, email
  `;
  const result = await query(sql, [nome, email, senhaHash, tipo]);
  return result.rows[0]; // Retorna o usuário recém-criado
}