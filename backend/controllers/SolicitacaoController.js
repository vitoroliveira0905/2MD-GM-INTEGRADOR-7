import SolicitacaoModel from '../models/SolicitacaoModel.js';

// Controller de Solicitações
class SolicitacaoController {
    // [GET] /solicitacoes?limite=10&pagina=1
    static async listarTodos(req, res) {
        try {
            const limite = parseInt(req.query.limite) || 10;
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * limite;

            const resultado = await SolicitacaoModel.listarTodos(limite, offset);
            res.status(200).json(resultado);
        } catch (error) {
            console.error('Erro no controller (listarTodos):', error);
            res.status(500).json({ erro: 'Erro ao listar solicitações' });
        }
    }

    // [GET] /solicitacoes/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const solicitacao = await SolicitacaoModel.buscarPorId(id);

            if (!solicitacao) {
                return res.status(404).json({ mensagem: 'Solicitação não encontrada' });
            }

            res.status(200).json(solicitacao);
        } catch (error) {
            console.error('Erro no controller (buscarPorId):', error);
            res.status(500).json({ erro: 'Erro ao buscar solicitação' });
        }
    }

    // [POST] /solicitacoes
    static async criar(req, res) {
        try {
            const dados = req.body;

            // (opcional) validações básicas
            if (!dados.usuario_id || !dados.produto_id || !dados.quantidade) {
                return res.status(400).json({ erro: 'Campos obrigatórios: usuario_id, produto_id, quantidade' });
            }

            const novaSolicitacao = await SolicitacaoModel.criar(dados);
            res.status(201).json({
                mensagem: 'Solicitação criada com sucesso',
                solicitacao: novaSolicitacao
            });
        } catch (error) {
            console.error('Erro no controller (criar):', error);
            res.status(500).json({ erro: 'Erro ao criar solicitação' });
        }
    }

    // [PUT] /solicitacoes/:id
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            const solicitacaoExistente = await SolicitacaoModel.buscarPorId(id);
            if (!solicitacaoExistente) {
                return res.status(404).json({ erro: 'Solicitação não encontrada' });
            }

            await SolicitacaoModel.atualizar(id, dados);
            res.status(200).json({ mensagem: 'Solicitação atualizada com sucesso' });
        } catch (error) {
            console.error('Erro no controller (atualizar):', error);
            res.status(500).json({ erro: 'Erro ao atualizar solicitação' });
        }
    }

    // [DELETE] /solicitacoes/:id
    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const solicitacaoExistente = await SolicitacaoModel.buscarPorId(id);

            if (!solicitacaoExistente) {
                return res.status(404).json({ erro: 'Solicitação não encontrada' });
            }

            await SolicitacaoModel.excluir(id);
            res.status(200).json({ mensagem: 'Solicitação excluída com sucesso' });
        } catch (error) {
            console.error('Erro no controller (excluir):', error);
            res.status(500).json({ erro: 'Erro ao excluir solicitação' });
        }
    }

    // [GET] /solicitacoes/usuario/:usuario_id
    static async buscarPorUsuario(req, res) {
        try {
            const { usuario_id } = req.params;
            const solicitacoes = await SolicitacaoModel.buscarPorUsuario(usuario_id);

            if (solicitacoes.length === 0) {
                return res.status(404).json({ mensagem: 'Nenhuma solicitação encontrada para este usuário' });
            }

            res.status(200).json(solicitacoes);
        } catch (error) {
            console.error('Erro no controller (buscarPorUsuario):', error);
            res.status(500).json({ erro: 'Erro ao buscar solicitações do usuário' });
        }
    }
}

export default SolicitacaoController;
