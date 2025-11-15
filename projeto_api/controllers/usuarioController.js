import { buscarUsuarioPorEmail, criarUsuario } from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Controller para REGISTRAR um novo usuário
export const registrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo = 'solicitante' } = req.body;

  try {
	// 1. Verifica se o usuário já existe
	const usuarioExistente = await buscarUsuarioPorEmail(email);
	if (usuarioExistente) {
	  return res.status(400).json({ message: 'E-mail já cadastrado.' });
	}

	// 2. Criptografa a senha
	const salt = await bcrypt.genSalt(10);
	const senhaHash = await bcrypt.hash(senha, salt);

	// 3. Salva no banco
	const novoUsuario = await criarUsuario(nome, email, senhaHash, tipo);

	res.status(201).json({ id: novoUsuario.id, email: novoUsuario.email });

  } catch (error) {
	res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Controller para LOGAR um usuário
export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
	// 1. Busca o usuário pelo e-mail
	const usuario = await buscarUsuarioPorEmail(email);
	if (!usuario) {
	  return res.status(401).json({ message: 'Credenciais inválidas.' });
	}

	// 2. Compara a senha enviada com a senha "hash" no banco
	const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
	if (!senhaCorreta) {
	  return res.status(401).json({ message: 'Credenciais inválidas.' });
	}

	// 3. Gera um Token JWT (JSON Web Token)
	const token = jwt.sign(
	  { id: usuario.id_usuario, tipo: usuario.tipo },
	  process.env.JWT_SECRET,
	  { expiresIn: '1h' } // Token expira em 1 hora
	);

	// 4. Retorna o token para o App
	res.status(200).json({
	  message: 'Login bem-sucedido!',
	  token: token,
	  usuario: {
		id: usuario.id_usuario,
		nome: usuario.nome,
		email: usuario.email,
		tipo: usuario.tipo
	  }
	});

  } catch (error) {
	res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};