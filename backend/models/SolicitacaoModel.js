import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

// Model para operações com solicitacoes
class SolicitacaoModel {
    // Listar todas as solicitaões (com paginação)
    static async listarTodos(limite, offset) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                SELECT 
                    s.*,
                    p.nome as produto_nome
                FROM solicitacoes s
                INNER JOIN produtos p ON p.id = s.produto_id
                ORDER BY s.id DESC
                LIMIT ? OFFSET ?
            `;

                const [solicitacoes] = await connection.query(sql, [limite, offset]);

                const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM solicitacoes');
                const total = totalResult[0].total;

                const paginaAtual = (offset / limite) + 1;
                const totalPaginas = Math.ceil(total / limite);

                return {
                    solicitacoes,
                    total,
                    pagina: paginaAtual,
                    limite,
                    totalPaginas
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar solicitacoes:', error);
            throw error;
        }
    }


    // Buscar solicitacao por ID
    static async buscarPorId(id) {
        try {
            const rows = await read('solicitacoes', `id = ${id}`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar solicitacao por ID:', error);
            throw error;
        }
    }

    // Criar novo solicitacao
    static async criar(dadosSolicitacao) {
        try {
            return await create('solicitacoes', dadosSolicitacao);
        } catch (error) {
            console.error('Erro ao criar solicitacao:', error);
            throw error;
        }
    }

    // Atualizar solicitacao
    static async atualizar(id, dadosSolicitacao) {
        try {
            return await update('solicitacoes', dadosSolicitacao, `id = ${id}`);
        } catch (error) {
            console.error('Erro ao atualizar solicitacao:', error);
            throw error;
        }
    }

    // Excluir solicitacao
    static async excluir(id) {
        try {
            return await deleteRecord('solicitacoes', `id = ${id}`);
        } catch (error) {
            console.error('Erro ao excluir solicitacao:', error);
            throw error;
        }
    }

    // Buscar solicitacoes por usuario
    static async buscarPorUsuario(usuario_id) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                SELECT 
                    s.*,
                    p.nome AS produto_nome
                FROM solicitacoes s
                INNER JOIN produtos p ON p.id = s.produto_id
                WHERE s.usuario_id = ?
                ORDER BY s.id DESC
            `;

                const [rows] = await connection.query(sql, [usuario_id]);
                return rows;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao buscar solicitacoes por usuário:', error);
            throw error;
        }
    }

}

export default SolicitacaoModel;
