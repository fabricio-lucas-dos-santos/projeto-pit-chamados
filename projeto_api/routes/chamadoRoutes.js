import express from 'express';
import {
  novoChamado,
  getChamados,
  getChamadoDetalhes,
  atualizarStatus,
  novoComentario
} from '../controllers/chamadoController.js';
import protegerRota from '../middleware/authMiddleware.js';

const router = express.Router();

// === Rotas Protegidas (Precisa de Token) ===

// Rota para criar um novo chamado: POST /api/chamados
router.post('/', protegerRota, novoChamado);

// Rota para listar todos os chamados: GET /api/chamados
router.get('/', protegerRota, getChamados);

// Rota para ver detalhes de um chamado: GET /api/chamados/:id
router.get('/:id', protegerRota, getChamadoDetalhes);

// Rota para técnico atualizar status: PUT /api/chamados/:id/status
router.put('/:id/status', protegerRota, atualizarStatus);

// Rota para adicionar comentário: POST /api/chamados/:id_chamado/comentarios
router.post('/:id_chamado/comentarios', protegerRota, novoComentario);

export default router;