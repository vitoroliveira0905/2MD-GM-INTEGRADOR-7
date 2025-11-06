INSERT INTO solicitacoes (
    usuario_id,
    produto_id,
    quantidade,
    shop,
    area,
    status,
    descricao
) VALUES
(2, 1, 10, 'SHOP A', 'Manutenção', 'pendente', 'Solicitação de reposição de ferramentas'),
(2, 2, 3, 'SHOP B', 'Produção', 'aprovado', 'Necessário para operação da linha 3'),
(2, 3, 1, 'SHOP C', 'Segurança', 'negado', 'Item fora do escopo de solicitação'),
(3, 4, 7, 'SHOP A', 'Logística', 'atendido', 'Reposição concluída'),
(3, 1, 2, 'SHOP D', 'Elétrica', 'pendente', 'Peças solicitadas para manutenção preventiva');
