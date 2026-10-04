import { Router, Request, Response } from 'express';
import prisma from '../Infrastructure/prismaClient';
import { verificarToken, verificarPerfilAdminOuGerente } from './middlewares/auth.middleware';

const productRoutes = Router();

// Listar todos os produtos (Cardápio)
productRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const produtos = await prisma.produto.findMany();
    return res.status(200).json(produtos);
  } catch (error) {
    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: 'Erro ao buscar produtos.',
      timestamp: new Date().toISOString()
    });
  }
});

// Cadastrar um produto inicial
productRoutes.post('/', verificarToken, verificarPerfilAdminOuGerente, async (req: Request, res: Response) => {
  try {
    const { nome, preco } = req.body;

    if (!nome || preco === undefined) {
      return res.status(400).json({
        error: 'DADOS_INVALIDOS',
        message: 'Nome e preço são obrigatórios.',
        timestamp: new Date().toISOString()
      });
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        preco: parseFloat(preco)
      }
    });

    return res.status(201).json(novoProduto);
  } catch (error) {
    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: 'Erro ao cadastrar produto.',
      timestamp: new Date().toISOString()
    });
  }
});

export default productRoutes;