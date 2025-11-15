import query from '../config/db.js';

// Modelo para buscar um usuário pelo e-mail
export async function buscarUsuarioPorEmail(email) {
  const sql = 'SELECT * FROM Usuario WHERE email = ?';
  const rows = await query(sql, [email]);
  return rows[0]; // Retorna o primeiro usuário (ou undefined)
}

// Modelo para criar um novo usuário
export async function criarUsuario(nome, email, senhaHash, tipo) {
  const sql = 'INSERT INTO Usuario (nome, email, senha_hash, tipo) VALUES (?, ?, ?, ?)';
  const result = await query(sql, [nome, email, senhaHash, tipo]);
  return { id: result.insertId, email };
}