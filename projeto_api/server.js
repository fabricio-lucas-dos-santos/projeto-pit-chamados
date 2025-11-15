import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from './routes/usuarioRoutes.js';
import chamadoRoutes from './routes/chamadoRoutes.js';

// Carrega variáveis de ambiente do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permite que seu app se conecte a esta API
app.use(express.json()); // Permite que o servidor entenda JSON

// Rotas
app.get('/', (req, res) => {
  res.send('API de Chamados de TI rodando!');
});

// Usa as rotas de usuário com o prefixo /api/usuarios
app.use('/api/usuarios', usuarioRoutes);

// Usa as rotas de chamado com o prefixo /api/chamados
app.use('/api/chamados', chamadoRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});