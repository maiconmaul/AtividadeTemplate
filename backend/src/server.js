require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Configure MONGODB_URI e JWT_SECRET no arquivo backend/.env.');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === 'MulterError' || error.message?.startsWith('Use uma imagem')) return res.status(400).json({ message: error.message });
  if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Identificador inválido.' });
  return res.status(500).json({ message: 'Erro interno do servidor.' });
});

const port = Number(process.env.PORT || 3000);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(port, '0.0.0.0', () => console.log(`API disponível na porta ${port}`)))
  .catch(error => { console.error('Não foi possível conectar ao MongoDB:', error.message); process.exit(1); });
