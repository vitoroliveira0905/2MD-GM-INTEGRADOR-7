import SolicitacaoModel from '../models/SolicitacaoModel.js';
import ProdutoModel from '../models/ProdutoModel.js';

// Controller de Solicitações
class SolicitacaoController {
    // [GET] /solicitacoes
    static async listarTodos(req, res) {
        try {
            const limite = parseInt(req.query.limite) || 10;
            const pagina = parseInt(req.query.pagina) || 1;
            const offset = (pagina - 1) * limite;

            // Se não for admin, só retorna solicitações do próprio usuário
            const usuarioId = req.usuario.id;
            const tipoUsuario = req.usuario.tipo;

            let resultado;

            if (tipoUsuario === 'admin') {
                resultado = await SolicitacaoModel.listarTodos(limite, offset);
            } else {
                const solicitacoes = await SolicitacaoModel.buscarPorUsuario(usuarioId);
                const total = solicitacoes.length;
                resultado = {
                    solicitacoes,
                    total,
                    pagina: 1,
                    limite,
                    totalPaginas: 1
                };
            }

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

            // Se não for admin, só pode ver se for dele
            if (req.usuario.tipo !== 'admin' && solicitacao.usuario_id !== req.usuario.id) {
                return res.status(403).json({
                    erro: 'Acesso negado',
                    mensagem: 'Você não tem permissão para acessar esta solicitação'
                });
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

            // Verificar se o status está sendo alterado para "finalizado"
            if (dados.status === 'finalizado') {
                const produtoId = solicitacaoExistente.produto_id;
                const quantidadeSolicitada = solicitacaoExistente.quantidade;

                // Buscar o produto no estoque
                const produto = await ProdutoModel.buscarPorId(produtoId);
                if (!produto) {
                    return res.status(404).json({ erro: 'Produto não encontrado no estoque' });
                }

                // Verificar se há estoque suficiente
                if (produto.quantidade < quantidadeSolicitada) {
                    return res.status(400).json({
                        erro: 'Estoque insuficiente',
                        mensagem: `O estoque atual (${produto.quantidade}) é insuficiente para atender à solicitação (${quantidadeSolicitada}).`
                    });
                }

                // Subtrair a quantidade do estoque
                await ProdutoModel.atualizar(produtoId, {
                    quantidade: produto.quantidade - quantidadeSolicitada
                });
            }

            // Atualizar a solicitação
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

    // Dentro do SolicitacaoController
    static async cancelarSolicitacao(req, res) {
        try {
            const { id } = req.params;
            const usuarioLogado = req.usuario;

            const solicitacao = await SolicitacaoModel.buscarPorId(id);
            if (!solicitacao) {
                return res.status(404).json({ erro: 'Solicitação não encontrada' });
            }

            // Bloqueia se a solicitação não for do usuário logado
            if (solicitacao.usuario_id !== usuarioLogado.id && usuarioLogado.tipo !== 'admin') {
                return res.status(403).json({
                    erro: 'Acesso negado',
                    mensagem: 'Você só pode cancelar suas próprias solicitações'
                });
            }

            // Só permite cancelar se ainda estiver pendente
            if (solicitacao.status !== 'pendente') {
                return res.status(400).json({
                    erro: 'Cancelamento não permitido',
                    mensagem: 'Apenas solicitações pendentes podem ser canceladas'
                });
            }

            // Atualiza o status para “cancelado”
            await SolicitacaoModel.atualizar(id, { status: 'cancelado' });

            res.status(200).json({
                mensagem: 'Solicitação cancelada com sucesso',
                solicitacao_id: id
            });
        } catch (error) {
            console.error('Erro no controller (cancelarSolicitacao):', error);
            res.status(500).json({ erro: 'Erro ao cancelar solicitação' });
        }
    }

}



export default SolicitacaoController;
