-- Migration: Criar tabela de solicitações
-- Data: 2025-11-06
-- Descrição: Tabela para registrar solicitações de itens

USE gerenciamento_tenda;

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

