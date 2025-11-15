import {
  criarChamado,
  listarChamados,
  buscarChamadoPorId,
  atualizarStatusChamado,
  adicionarComentario
} from '../models/chamadoModel.js';

// Controller para CRIAR um novo chamado
export const novoChamado = async (req, res) => {
  const { titulo, descricao, prioridade } = req.body;
  // Pegamos o 'id_usuario' do token, que foi injetado pelo middleware
  const id_solicitante = req.usuario.id;

  try {
	const chamado = await criarChamado(titulo, descricao, prioridade, id_solicitante);
	res.status(201).json({ message: 'Chamado criado com sucesso!', id: chamado.id });
  } catch (error) {
	res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Controller para LISTAR todos os chamados
export const getChamados = async (req, res) => {
  try {
	const chamados = await listarChamados();
	res.status(200).json(chamados);
  } catch (error) {
	res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Controller para VER DETALHES de um chamado
export const getChamadoDetalhes = async (req, res) => {
  const { id } = req.params; // Pega o ID da URL (ex: /api/chamados/12)
  try {
	const chamado = await buscarChamadoPorId(id);
	if (!chamado) {
	  return res.status(404).json({ message: 'Chamado não encontrado.' });
	}
	res.status(200).json(chamado);
  } catch (error) {
	res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Controller para o TÉCNICO atualizar o status
export const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { novo_status } = req.body;
  const id_tecnico = req.usuario.id; // ID do técnico logado (vem do token)
  const tipo_usuario = req.usuario.tipo; // Tipo (vem do token)

  // Só permite que técnicos atualizem o status
  if (tipo_usuario !== 'tecnico') {
	return res.status(403).json({ message: 'Acesso negado. Apenas técnicos podem alterar o status.' });
  }

  try {
	const affectedRows = await atualizarStatusChamado(id, novo_status, id_tecnico);
	if (affectedRows === 0) {
	  return res.status(404).json({ message: 'Chamado não encontrado.' });
	}
	res.status(200).json({ message: 'Status atualizado com sucesso!' });
  } catch (error) {
	res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Controller para ADICIONAR um comentário
export const novoComentario = async (req, res) => {
  const { id_chamado } = req.params; // O ID vem da URL
  const { texto } = req.body;
  const id_usuario = req.usuario.id; // ID do usuário logado (vem do token)

  try {
	const comentario = await adicionarComentario(texto, id_chamado, id_usuario);
	res.status(201).json({ message: 'Comentário adicionado!', id: comentario.id });
  } catch (error) {
	res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};