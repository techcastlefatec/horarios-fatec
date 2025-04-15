
-- Tabela que armazena os cursos disponíveis
CREATE TABLE IF NOT EXISTS tbcurso (
    id_curso SERIAL PRIMARY KEY,  -- Identificador único do curso
    nome_curso VARCHAR(200) NOT NULL  -- Nome do curso
);

-- Tabela que armazena as turmas, associando cada turma a um curso
CREATE TABLE IF NOT EXISTS tbturma (
    id_turma SERIAL PRIMARY KEY,  -- Identificador único da turma
    nome_turma VARCHAR(200) NOT NULL,  -- Nome da turma
    periodo_turma VARCHAR(20) NOT NULL,  -- Período da turma (exemplo: "2025/1")
    curso_id INT REFERENCES tbcurso(id_curso) ON DELETE CASCADE  -- Relaciona a turma a um curso
);

-- Tabela que armazena os professores
CREATE TABLE IF NOT EXISTS tbprofessor (
    id_professor SERIAL PRIMARY KEY,  -- Identificador único do professor
    nome_professor VARCHAR(100) NOT NULL,  -- Nome do professor
    email_professor VARCHAR(200) NOT NULL  -- E-mail do professor
);

-- Tabela que armazena os semestres, que podem estar relacionados aos cursos
CREATE TABLE IF NOT EXISTS tbsemestre (
    id_semestre SERIAL PRIMARY KEY,  -- Identificador único do semestre
    nome_curso VARCHAR(200) NOT NULL  -- Nome do curso associado ao semestre (exemplo: "Sistemas de Informação")
);

-- Tabela que armazena as matérias
CREATE TABLE IF NOT EXISTS tbdisciplina (
    id_disciplina SERIAL PRIMARY KEY,  -- Identificador único da disciplina
    nome_disciplina VARCHAR(200) NOT NULL  -- Nome da disciplina
);

-- Tabela que armazena as salas, com informações sobre o nome e andar
CREATE TABLE IF NOT EXISTS tbsala (
    id_sala SERIAL PRIMARY KEY,  -- Identificador único da sala
    nome_sala VARCHAR(200) NOT NULL,  -- Nome da sala (exemplo: "Sala 101")
    andar_sala VARCHAR(200) NOT NULL  -- Andar onde a sala está localizada
);

-- Tabela que armazena os horários de aulas, com início e fim
CREATE TABLE IF NOT EXISTS tbhorarios (
    id_horarios SERIAL PRIMARY KEY,  -- Identificador único do horário
    hora_inicio TIME NOT NULL,  -- Hora de início da aula
    hora_fim TIME NOT NULL  -- Hora de término da aula
);

-- Tabela que armazena as aulas, associando turma, professor, matéria, sala e horário
CREATE TABLE IF NOT EXISTS tbaulas (
    id_aulas SERIAL PRIMARY KEY,  -- Identificador único da aula
    turma_id INT REFERENCES tbturma(id_turma) ON DELETE CASCADE,  -- Relaciona a aula a uma turma
    professor_id INT REFERENCES tbprofessor(id_professor) ON DELETE SET NULL,  -- Relaciona a aula a um professor (pode ser NULL)
    discplina_id INT REFERENCES tbdisciplina(id_disciplina) ON DELETE CASCADE,  -- Relaciona a aula a uma matéria
    sala_id INT REFERENCES tbsala(id_sala) ON DELETE SET NULL,  -- Relaciona a aula a uma sala (pode ser NULL)
    horario_id INT REFERENCES tbhorarios(id_horarios) ON DELETE CASCADE  -- Relaciona a aula a um horário
);

-- Tabela intermediária que relaciona semestres às matérias
CREATE TABLE IF NOT EXISTS tbsemestre_disciplina (
    semestre_id INT REFERENCES tbsemestre(id_semestre) ON DELETE CASCADE,  -- Relaciona o semestre
    disciplina_id INT REFERENCES tbdisciplina(id_disciplina) ON DELETE CASCADE,  -- Relaciona a matéria
    PRIMARY KEY (semestre_id, disciplina_id)  -- Chave composta para garantir a unicidade do relacionamento
);
