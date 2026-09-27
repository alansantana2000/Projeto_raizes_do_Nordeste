import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../Infrastructure/prismaClient';

const authRoutes = Router();

// Rota de Cadastro
authRoutes.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    // Verifica se o utilizador já existe
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({
        error: "CONFLITO",
        message: "Este e-mail já está em uso."
      });
    }

    // Hash da palavra-passe (Regra de Segurança/LGPD)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Cria o utilizador no banco de dados
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil: perfil || 'CLIENTE' // CLIENTE é o padrão se não for enviado
      }
    });

    return res.status(201).json({
      message: "Utilizador criado com sucesso!",
      usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email, perfil: novoUsuario.perfil }
    });

  } catch (error) {
    return res.status(500).json({ error: "ERRO_INTERNO", message: "Erro ao processar o registo." });
  }
});

// Rota de Login
authRoutes.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "NAO_AUTORIZADO", message: "E-mail ou palavra-passe incorretos." });
    }

    // Verifica se a palavra-passe coincide com o Hash
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ error: "NAO_AUTORIZADO", message: "E-mail ou palavra-passe incorretos." });
    }

    // Gera o Token JWT
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      accessToken: token,
      usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil }
    });

  } catch (error) {
    return res.status(500).json({ error: "ERRO_INTERNO", message: "Erro ao processar o login." });
  }
});

export default authRoutes;