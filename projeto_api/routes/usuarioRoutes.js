import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/usuarioController.js';

const router = express.Router();

// Rota para registrar: POST /api/usuarios/registrar
router.post('/registrar', registrarUsuario);

// Rota para logar: POST /api/usuarios/login
router.post('/login', loginUsuario);

export default router;