import query from '../config/db.js';

// Modelo para CRIAR um novo chamado
export async function criarChamado(titulo, descricao, prioridade, id_solicitante) {
  const sql = 'INSERT INTO Chamado (titulo, descricao, prioridade, id_solicitante, status, data_abertura) VALUES (?, ?, ?, ?, ?, NOW())';
  const result = await query(sql, [titulo, descricao, prioridade, id_solicitante]);
  return { id: result.insertId };
}

// Modelo para LISTAR todos os chamados (com nome do solicitante e técnico)
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
  const rows = await query(sql);
  return rows;
}

// Modelo para BUSCAR um chamado específico (detalhes)
export async function buscarChamadoPorId(id_chamado) {
  // Busca o chamado
  const sqlChamado = 'SELECT * FROM Chamado WHERE id_chamado = ?';
  const chamado = await query(sqlChamado, [id_chamado]);
  
  if (!chamado[0]) return null;

  // Busca os comentários do chamado
  const sqlComentarios = `
	SELECT co.texto, co.data_comentario, u.nome AS nome_usuario
	FROM Comentario co
	JOIN Usuario u ON co.id_usuario = u.id_usuario
	WHERE co.id_chamado = ?
	ORDER BY co.data_comentario ASC
  `;
  const comentarios = await query(sqlComentarios, [id_chamado]);

  // Retorna o chamado e seus comentários
  return { ...chamado[0], comentarios };
}

// Modelo para ATUALIZAR o status de um chamado
export async function atualizarStatusChamado(id_chamado, novo_status, id_tecnico) {
  // Se for o primeiro "atendimento", define o técnico
  const sql = 'UPDATE Chamado SET status = ?, id_tecnico = IFNULL(id_tecnico, ?) WHERE id_chamado = ?';
  const result = await query(sql, [novo_status, id_tecnico, id_chamado]);
  return result.affectedRows;
}

// Modelo para ADICIONAR um comentário
export async function adicionarComentario(texto, id_chamado, id_usuario) {
  const sql = 'INSERT INTO Comentario (texto, id_chamado, id_usuario, data_comentario) VALUES (?, ?, ?, NOW())';
  const result = await query(sql, [texto, id_chamado, id_usuario]);
  return { id: result.insertId };
}