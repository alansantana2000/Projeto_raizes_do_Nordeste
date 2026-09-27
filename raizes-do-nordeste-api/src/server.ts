import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './API/auth.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---> LIGAÇÃO DAS ROTAS AQUI <---
app.use('/auth', authRoutes);

// Rota de teste
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API Raízes do Nordeste a funcionar!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});