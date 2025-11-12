import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

// Rotas acessíveis a todos os usuários logados
router.get('/', ProdutoController.listarTodos);
router.get('/:id', ProdutoController.buscarPorId);

// Rotas que só o admin pode acessar
router.post('/', adminMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.criar);
router.post('/upload', adminMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.uploadImagem);
router.put('/:id', adminMiddleware, uploadImagens.single('imagem'), handleUploadError, ProdutoController.atualizar);
router.delete('/:id', adminMiddleware, ProdutoController.excluir);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/upload', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
});

export default router;

