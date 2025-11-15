import jwt from 'jsonwebtoken';

const protegerRota = (req, res, next) => {
  let token;

  // O token vem no cabeçalho 'Authorization' como "Bearer TOKEN"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
	try {
	  // 1. Pega o token (removendo o "Bearer ")
	  token = req.headers.authorization.split(' ')[1];

	  // 2. Verifica se o token é válido
	  const decoded = jwt.verify(token, process.env.JWT_SECRET);

	  // 3. Adiciona os dados do usuário (id e tipo) no objeto 'req'
	  req.usuario = decoded;

	  // 4. Deixa a requisição continuar
	  next();

	} catch (error) {
	  res.status(401).json({ message: 'Token inválido ou expirado.' });
	}
  }

  if (!token) {
	res.status(401).json({ message: 'Acesso negado. Nenhum token enviado.' });
  }
};

export default protegerRota;