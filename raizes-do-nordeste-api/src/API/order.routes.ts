import { Router, Request, Response } from 'express';
import prisma from '../Infrastructure/prismaClient';
import { CanalPedido, StatusPedido } from '@prisma/client';
import { verificarToken } from './middlewares/auth.middleware';

const orderRoutes = Router();

// 1. Criar Pedido - Protegido
orderRoutes.post('/', verificarToken, async (req: Request, res: Response) => {
  try {
    const { canalPedido, usuarioId, itens } = req.body;

    // Validação da multicanalidade exigida pelo roteiro
    const canaisValidos = Object.values(CanalPedido);
    if (!canalPedido || !canaisValidos.includes(canalPedido)) {
      return res.status(400).json({
        error: 'CANAL_INVALIDO',
        message: `O campo 'canalPedido' é obrigatório. Valores permitidos: ${canaisValidos.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    if (!usuarioId || !itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(422).json({
        error: 'REQUISICAO_INVALIDA',
        message: 'Informe o usuarioId e pelo menos um item no pedido.',
        timestamp: new Date().toISOString()
      });
    }

    // Calcula o total consultando os preços reais no banco
    let total = 0;
    const itensParaSalvar: { produtoId: number; quantidade: number }[] = [];

    for (const item of itens) {
      const prod = await prisma.produto.findUnique({ where: { id: item.produtoId } });
      if (!prod) {
        return res.status(404).json({
          error: 'PRODUTO_NAO_ENCONTRADO',
          message: `Produto ID ${item.produtoId} não encontrado no cardápio.`,
          timestamp: new Date().toISOString()
        });
      }
      total += prod.preco * item.quantidade;
      itensParaSalvar.push({ produtoId: prod.id, quantidade: item.quantidade });
    }

    // Criação do pedido com seus itens
    const pedido = await prisma.pedido.create({
      data: {
        canalPedido,
        total,
        usuarioId,
        status: StatusPedido.AGUARDANDO_PAGAMENTO,
        itens: {
          create: itensParaSalvar
        }
      },
      include: {
        itens: {
          include: { produto: true }
        }
      }
    });

    return res.status(201).json(pedido);
  } catch (error) {
    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: 'Erro ao processar pedido.',
      timestamp: new Date().toISOString()
    });
  }
});

// 2. Listar Pedidos (com filtro por canalPedido, conforme requisito)
orderRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { canalPedido } = req.query;

    const whereClause: any = {};
    if (canalPedido && Object.values(CanalPedido).includes(canalPedido as CanalPedido)) {
      whereClause.canalPedido = canalPedido;
    }

    const pedidos = await prisma.pedido.findMany({
      where: whereClause,
      include: { itens: { include: { produto: true } } }
    });

    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: 'Erro ao listar pedidos.',
      timestamp: new Date().toISOString()
    });
  }
});

// 3. Pagamento Mock (Simulação externa desacoplada)
orderRoutes.post('/:id/pagamento-mock', async (req: Request, res: Response) => {
  try {
    const pedidoId = parseInt(req.params.id);
    const { statusSimulado } = req.body; // 'APROVADO' ou 'RECUSADO'

    const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });

    if (!pedido) {
      return res.status(404).json({
        error: 'PEDIDO_NAO_ENCONTRADO',
        message: 'Pedido não localizado.',
        timestamp: new Date().toISOString()
      });
    }

    if (statusSimulado === 'RECUSADO') {
      return res.status(400).json({
        statusGateway: 'RECUSADO',
        message: 'Pagamento não autorizado pela operadora financeira simulada.',
        timestamp: new Date().toISOString()
      });
    }

    // Se aprovado, avança o status do pedido para a COZINHA
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: pedidoId },
      data: { status: StatusPedido.COZINHA }
    });

    return res.status(200).json({
      statusGateway: 'APROVADO',
      message: 'Pagamento processado com sucesso. Pedido enviado para a cozinha.',
      pedido: pedidoAtualizado,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'ERRO_INTERNO',
      message: 'Falha na comunicação com gateway de pagamento mock.',
      timestamp: new Date().toISOString()
    });
  }
});

export default orderRoutes;