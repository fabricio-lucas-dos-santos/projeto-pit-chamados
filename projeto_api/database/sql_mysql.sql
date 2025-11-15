-- Projeto Físico do Banco de Dados (Script SQL para MySQL)

-- Tabela de Usuários (para Solicitantes e Técnicos)
CREATE TABLE Usuario (
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	senha_hash VARCHAR(255) NOT NULL,
	tipo ENUM('solicitante', 'tecnico') NOT NULL DEFAULT 'solicitante'
) ENGINE=InnoDB;

-- Tabela de Chamados
CREATE TABLE Chamado (
	id_chamado INT AUTO_INCREMENT PRIMARY KEY,
	titulo VARCHAR(150) NOT NULL,
	descricao TEXT NOT NULL,
	status ENUM('Aberto', 'Em Andamento', 'Aguardando Usuário', 'Resolvido', 'Fechado') NOT NULL DEFAULT 'Aberto',
	prioridade ENUM('Baixa', 'Média', 'Alta') NOT NULL DEFAULT 'Baixa',
	data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
	id_solicitante INT NOT NULL,
	id_tecnico INT NULL,
	
	FOREIGN KEY (id_solicitante) REFERENCES Usuario(id_usuario),
	FOREIGN KEY (id_tecnico) REFERENCES Usuario(id_usuario)
) ENGINE=InnoDB;

-- Tabela de Comentários (histórico do chamado)
CREATE TABLE Comentario (
	id_comentario INT AUTO_INCREMENT PRIMARY KEY,
	texto TEXT NOT NULL,
	data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
	id_chamado INT NOT NULL,
	id_usuario INT NOT NULL,
	
	-- Se um chamado for deletado, todos os seus comentários são deletados juntos.
	FOREIGN KEY (id_chamado) REFERENCES Chamado(id_chamado) ON DELETE CASCADE,
	FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
) ENGINE=InnoDB;