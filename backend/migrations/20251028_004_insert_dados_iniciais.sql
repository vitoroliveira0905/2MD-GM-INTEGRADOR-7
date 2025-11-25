-- Migration: Inserir dados iniciais
-- Data: 2025-01-15
-- Descrição: Dados iniciais para teste do sistema

USE produtos_api;

-- Inserir usuários iniciais (senha: 123456)
-- Hash gerado com bcrypt para a senha "123456" (validado)
INSERT INTO usuarios (nome, email, senha, tipo) VALUES
('Administrador', 'admin@produtos.com', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'admin'),
('João Silva', 'joao@email.com', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'comum'),
('Maria Souza', 'maria@email.com', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'comum');

-- Inserir produtos iniciais
INSERT INTO produtos (nome, descricao, preco, categoria, imagem, quantidade, minimo_estoque) VALUES
('Smartphone Galaxy', 'Celular Samsung Galaxy com 128GB', 1299.99, 'Eletrônicos', 'smartphone.jpg', 10, 5),
('Notebook Dell', 'Notebook Dell Inspiron 15 polegadas', 2499.99, 'Eletrônicos', 'notebook.jpg', 20, 10),
('Camiseta Polo', 'Camiseta polo masculina azul', 89.90, 'Roupas', 'camiseta.jpg', 5, 2),
('Livro JavaScript', 'Livro sobre programação JavaScript', 79.90, 'Livros', 'livro.jpg', 0, 1);

-- Inserir solicitações iniciais
INSERT INTO solicitacoes (
    usuario_id,
    produto_id,
    quantidade,
    shop,
    area,
    status,
    descricao,
    observacao
) VALUES
(2, 1, 10, 'SHOP A', 'Manutenção', 'pendente', 'Solicitação de reposição de ferramentas', NULL),
(2, 2, 3, 'SHOP B', 'Produção', 'aprovado', 'Necessário para operação da linha 3', NULL),
(2, 3, 1, 'SHOP C', 'Segurança', 'recusado', 'Item fora do escopo de solicitação','Não quero'),
(3, 4, 7, 'SHOP A', 'Logística', 'finalizado', 'Reposição concluída', NULL),
(3, 1, 2, 'SHOP D', 'Elétrica', 'pendente', 'Peças solicitadas para manutenção preventiva', NULL);