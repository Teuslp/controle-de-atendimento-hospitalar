require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuração CORS para desenvolvimento
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Rotas
const senhasRouter = require('./routes/senhasRoute');
const chamadasRouter = require('./routes/chamadasRoute');

app.use('/senhas', senhasRouter);
app.use('/chamadas', chamadasRouter);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Sistema de Atendimento Lab Médico');
});

// Inicia servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});