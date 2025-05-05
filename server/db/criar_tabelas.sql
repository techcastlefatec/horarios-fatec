-- ============================
-- Tabelas principais
-- ============================

CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    periodo VARCHAR(20),
    curso_id INT NOT NULL,
    CONSTRAINT fk_turmas_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

CREATE TABLE professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    foto VARCHAR(255) DEFAULT 'default.png'
);

CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    andar VARCHAR(50)
);

CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL
);


CREATE TABLE aulas (
    id SERIAL PRIMARY KEY,
    curso_id INT NOT NULL,
    turma_id INT NOT NULL,
    professor_id INT,
    materia_id INT,
    sala_id INT,
    horario_id INT NOT NULL,
    dia_semana VARCHAR(10) NOT NULL CHECK (dia_semana IN ('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta')),

    CONSTRAINT fk_aulas_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    CONSTRAINT fk_aulas_turma FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
    CONSTRAINT fk_aulas_professor FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE SET NULL,
    CONSTRAINT fk_aulas_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    CONSTRAINT fk_aulas_sala FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE SET NULL,
    CONSTRAINT fk_aulas_horario FOREIGN KEY (horario_id) REFERENCES horarios(id) ON DELETE CASCADE
);



-- ============================
-- Tabelas adicionais
-- ============================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);
-- Inserção do usuário da secretaria
INSERT INTO users (nome, email, senha) VALUES ('Administrador', 'secretaria@fatec.com', '12345678');
