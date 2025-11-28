-- Migration: Inserir dados iniciais
-- Data: 2025-01-15
-- Descrição: Dados iniciais para teste do sistema

USE produtos_api;

-- Inserir usuários iniciais (senha: 123456)
-- Hash gerado com bcrypt para a senha "123456" (validado)
-- Inserir usuários iniciais com hash de senha e imagem
INSERT INTO usuarios (nome, email, gmin, senha, tipo, imagem) VALUES
('Administrador', 'admin@empresa.com', '123456', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'admin', 'admFoto.jpg'),
('João Silva', 'joao@empresa.com', '111111', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'comum', 'joaoFoto.jpg'),
('Maria Souza', 'maria@empresa.com', '000000', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'comum', 'mariaFoto.jpg');

-- Inserir produtos iniciais
INSERT INTO produtos (nome, descricao, preco, categoria, imagem, quantidade, minimo_estoque) VALUES
('Capacete', 'Capacete de proteção para segurança', 49.99, 'EPI', 'capacete.jpg', 5, 10),
('Óculos de Segurança', 'Óculos de proteção para olhos', 19.99, 'EPI', 'oculos.jpg', 100, 20),
('Parafuso M6', 'Parafuso de aço M6', 0.50, 'Ferramentas', 'parafuso_m6.jpg', 1000, 200),
('Porca M6', 'Porca de aço M6', 0.30, 'Ferramentas', 'porca_m6.jpg', 1000, 200),
('Chave de Fenda', 'Chave de fenda simples', 12.00, 'Ferramentas', 'chave_fenda.jpg', 50, 10),
('Martelo', 'Martelo de aço com cabo de madeira', 25.00, 'Ferramentas', 'martelo.jpg', 30, 5),
('Luva de Proteção', 'Luva de segurança para mãos', 15.00, 'EPI', 'luva.jpg', 200, 50),
('Máscara Respiratória', 'Máscara de proteção respiratória', 29.99, 'EPI', 'mascara.jpg', 100, 20),
('Fita Isolante', 'Fita isolante elétrica', 5.00, 'Consumíveis', 'fita_isolante.jpg', 150, 30),
('Chave Combinada 10mm', 'Chave para aperto e desaperto', 15.00, 'Ferramentas', 'chave_combinada_10.jpg', 40, 10),
('Lanterna de Mão', 'Lanterna para inspeção e manutenção', 35.00, 'Ferramentas', 'lanterna.jpg', 4, 5),
('Óleo Lubrificante', 'Óleo para manutenção de máquinas', 50.00, 'Consumíveis', 'oleo_lubrificante.jpg', 15, 20),
('Parafuso M8', 'Parafuso de aço M8', 0.75, 'Ferramentas', 'parafuso_m8.jpg', 0, 150),
('Porca M8', 'Porca de aço M8', 0.50, 'Ferramentas', 'porca_m8.jpg', 800, 150),
('Chave Inglesa 12"', 'Chave ajustável de 12 polegadas', 55.00, 'Ferramentas', 'chave_inglesa.jpg', 20, 5),
('Lixa 120', 'Lixa para acabamento de madeira e metal', 2.50, 'Consumíveis', 'lixa_120.jpg', 0, 50);

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