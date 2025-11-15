-- Projeto Físico do Banco de Dados (Script SQL para PostgreSQL)

-- Tabela de Usuários
CREATE TABLE Usuario (
	id_usuario SERIAL PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	senha_hash VARCHAR(255) NOT NULL,
	tipo VARCHAR(11) NOT NULL DEFAULT 'solicitante'
		CHECK (tipo IN ('solicitante', 'tecnico'))
);

-- Tabela de Chamados
CREATE TABLE Chamado (
	id_chamado SERIAL PRIMARY KEY,
	titulo VARCHAR(150) NOT NULL,
	descricao TEXT NOT NULL,
	status VARCHAR(20) NOT NULL DEFAULT 'Aberto'
		CHECK (status IN ('Aberto', 'Em Andamento', 'Aguardando Usuário', 'Resolvido', 'Fechado')),
	prioridade VARCHAR(5) NOT NULL DEFAULT 'Baixa'
		CHECK (prioridade IN ('Baixa', 'Média', 'Alta')),
	data_abertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	id_solicitante INT NOT NULL,
	id_tecnico INT NULL,
	
	FOREIGN KEY (id_solicitante) REFERENCES Usuario(id_usuario),
	FOREIGN KEY (id_tecnico) REFERENCES Usuario(id_usuario)
);

-- Tabela de Comentários
CREATE TABLE Comentario (
	id_comentario SERIAL PRIMARY KEY,
	texto TEXT NOT NULL,
	data_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	id_chamado INT NOT NULL,
	id_usuario INT NOT NULL,
	
	FOREIGN KEY (id_chamado) REFERENCES Chamado(id_chamado) ON DELETE CASCADE,
	FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);