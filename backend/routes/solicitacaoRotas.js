import express from 'express';
import SolicitacaoController from '../controllers/SolicitacaoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// Rotas acessíveis a todos os usuários logados
router.post('/', SolicitacaoController.criar);
router.get('/', SolicitacaoController.listarTodos); // lista apenas as próprias, no controller
router.put('/:id/cancelar', SolicitacaoController.cancelarSolicitacao);
router.get('/:id', SolicitacaoController.buscarPorId);

// Rotas que só o admin pode acessar
router.put('/:id', adminMiddleware, SolicitacaoController.atualizar);   // atualizar qualquer solicitação
router.delete('/:id', adminMiddleware, SolicitacaoController.excluir); // excluir solicitações
router.get('/usuario/:usuario_id', adminMiddleware, SolicitacaoController.buscarPorUsuario); // ver solicitações de outros usuários




export default router;
