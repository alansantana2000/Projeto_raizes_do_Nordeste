import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './API/auth.routes';
import productRoutes from './API/product.routes';
import orderRoutes from './API/order.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swaggerDocument';

dotenv.config();

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/auth', authRoutes);
app.use('/produtos', productRoutes);
app.use('/pedidos', orderRoutes);

// Rota de Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API Raízes do Nordeste operacional!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});