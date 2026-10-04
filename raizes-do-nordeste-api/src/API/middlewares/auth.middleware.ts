import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estende a interface Request do Express para incluir o utilizador decodificado
export interface CustomRequest extends Request {
  usuario?: any;
}

export const verificarToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'NAO_AUTORIZADO',
      message: 'Token de autenticação não fornecido.',
      timestamp: new Date().toISOString()
    });
  }

  // O formato esperado é "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET as string);
    req.usuario = decodificado; // Guarda os dados do utilizador na requisição
    next(); // Permite que a requisição continue para a rota
  } catch (error) {
    return res.status(401).json({
      error: 'NAO_AUTORIZADO',
      message: 'Token inválido ou expirado.',
      timestamp: new Date().toISOString()
    });
  }
};

export const verificarPerfilAdminOuGerente = (req: CustomRequest, res: Response, next: NextFunction) => {
  const usuario = req.usuario;
  
  if (!usuario || (usuario.perfil !== 'ADMIN' && usuario.perfil !== 'GERENTE')) {
    return res.status(403).json({
      error: 'ACESSO_NEGADO',
      message: 'Não tem permissão para realizar esta ação.',
      timestamp: new Date().toISOString()
    });
  }
  next();
};