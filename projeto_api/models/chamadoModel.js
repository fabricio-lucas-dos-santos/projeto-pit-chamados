import { query } from '../config/db.js';

// Modelo para CRIAR um novo chamado
export async function criarChamado(titulo, descricao, prioridade, id_solicitante) {
  const sql = `
    INSERT INTO Chamado (titulo, descricao, prioridade, id_solicitante, status, data_abertura) 
    VALUES ($1, $2, $3, $4, 'Aberto', NOW())
    RETURNING id_chamado
  `;
  const result = await query(sql, [titulo, descricao, prioridade, id_solicitante]);
  return result.rows[0];
}

// Modelo para LISTAR todos os chamados
export async function listarChamados() {
  const sql = `
    SELECT 
      c.id_chamado, c.titulo, c.status, c.prioridade, c.data_abertura,
      solicitante.nome AS nome_solicitante,
      tecnico.nome AS nome_tecnico
    FROM Chamado c
    JOIN Usuario solicitante ON c.id_solicitante = solicitante.id_usuario
    LEFT JOIN Usuario tecnico ON c.id_tecnico = tecnico.id_usuario
    ORDER BY c.data_abertura DESC
  `;
  const result = await query(sql);
  return result.rows;
}

// Modelo para BUSCAR um chamado específico (detalhes)
export async function buscarChamadoPorId(id_chamado) {
  const sqlChamado = 'SELECT * FROM Chamado WHERE id_chamado = $1';
  const resultChamado = await query(sqlChamado, [id_chamado]);
  
  if (!resultChamado.rows[0]) return null;

  const sqlComentarios = `
    SELECT co.texto, co.data_comentario, u.nome AS nome_usuario
    FROM Comentario co
    JOIN Usuario u ON co.id_usuario = u.id_usuario
    WHERE co.id_chamado = $1
    ORDER BY co.data_comentario ASC
  `;
  const resultComentarios = await query(sqlComentarios, [id_chamado]);

  return { ...resultChamado.rows[0], comentarios: resultComentarios.rows };
}

// Modelo para ATUALIZAR o status de um chamado
export async function atualizarStatusChamado(id_chamado, novo_status, id_tecnico) {
  const sql = `
    UPDATE Chamado 
    SET status = $1, id_tecnico = COALESCE(id_tecnico, $2) 
    WHERE id_chamado = $3
  `;
  const result = await query(sql, [novo_status, id_tecnico, id_chamado]);
  return result.rowCount; // Retorna o número de linhas afetadas
}

// Modelo para ADICIONAR um comentário
export async function adicionarComentario(texto, id_chamado, id_usuario) {
  const sql = `
    INSERT INTO Comentario (texto, id_chamado, id_usuario, data_comentario) 
    VALUES ($1, $2, $3, NOW())
    RETURNING id_comentario
  `;
  const result = await query(sql, [texto, id_chamado, id_usuario]);
  return result.rows[0];
}