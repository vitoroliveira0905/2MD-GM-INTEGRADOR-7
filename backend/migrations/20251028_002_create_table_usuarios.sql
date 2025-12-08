-- Migration: Criar tabela usuarios
-- Data: 2025-01-15
-- Descrição: Tabela para armazenar usuários do sistema

USE gerenciamento_tenda;
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
