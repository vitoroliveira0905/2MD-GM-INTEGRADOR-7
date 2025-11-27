-- Migration: Criar banco de dados produtos_api
-- Data: 2025-01-15
-- Descrição: Criação inicial do banco de dados

CREATE DATABASE IF NOT EXISTS produtos_api;

-- Usar o banco de dados criado
USE produtos_api;

-- Migration: Criar tabela usuarios
-- Data: 2025-01-15
-- Descrição: Tabela para armazenar usuários do sistema

USE produtos_api;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    gmin VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tipo ENUM('admin', 'comum') NOT NULL DEFAULT 'comum',
    imagem VARCHAR(255) DEFAULT 'default.jpg', -- ✅ nova coluna para a foto
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Migration: Criar tabela produtos
-- Data: 2025-01-15
-- Descrição: Tabela para armazenar produtos do sistema

USE produtos_api;

CREATE TABLE IF NOT EXISTS produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) DEFAULT 'Geral',
    imagem VARCHAR(255),
    quantidade INT NOT NULL DEFAULT 0,
    minimo_estoque INT NOT NULL DEFAULT 1,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Migration: Criar tabela logs
-- Data: 2025-10-28
-- Descrição: Tabela para registrar logs de acesso às rotas da API

USE produtos_api;

CREATE TABLE IF NOT EXISTS logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    rota VARCHAR(255) NOT NULL,
    metodo VARCHAR(10) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status_code INT,
    tempo_resposta_ms INT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    dados_requisicao JSON,
    dados_resposta JSON,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Índices para melhorar performance das consultas
CREATE INDEX idx_logs_usuario_id ON logs(usuario_id);
CREATE INDEX idx_logs_data_hora ON logs(data_hora);
CREATE INDEX idx_logs_rota ON logs(rota);
CREATE INDEX idx_logs_metodo ON logs(metodo);
CREATE INDEX idx_logs_status_code ON logs(status_code);

-- Migration: Criar tabela de solicitações
-- Data: 2025-11-06
-- Descrição: Tabela para registrar solicitações de itens

USE produtos_api;

CREATE TABLE IF NOT EXISTS solicitacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    shop varchar(50) not null,
    area varchar(50) not null,
    status ENUM('pendente', 'aprovado', 'recusado', 'finalizado', 'cancelado') DEFAULT 'pendente',
    descricao TEXT,
    observacao TEXT,
    data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relacionamentos
    CONSTRAINT fk_solicitacoes_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_solicitacoes_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Migration: Inserir dados iniciais
-- Data: 2025-01-15
-- Descrição: Dados iniciais para teste do sistema

USE produtos_api;

-- Inserir usuários iniciais (senha: 123456)
-- Hash gerado com bcrypt para a senha "123456" (validado)
-- Inserir usuários iniciais com hash de senha e imagem
INSERT INTO usuarios (nome, email, gmin, senha, tipo, imagem) VALUES
('Administrador', 'admin@empresa.com', '123456', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'admin', 'admin.jpg'),
('João Silva', 'joao@empresa.com', '111111', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'comum', 'joao.jpg'),
('Maria Souza', 'maria@empresa.com', '000000', '$2a$10$BLAcJu1irAzg06WbtoLoPe0RA.hkfZ0oJ25KYARPkHWRweJuWBALy', 'comum', 'maria.jpg');



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