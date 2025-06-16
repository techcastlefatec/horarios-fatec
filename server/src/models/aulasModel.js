const pool = require('../config/db');

async function listarAulas() {
  const result = await pool.query('SELECT * FROM aulas ORDER BY id');
  return result.rows;
}

async function obterAula(id) {
  const result = await pool.query('SELECT * FROM aulas WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarAula(curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana) {
  const result = await pool.query(
    `INSERT INTO aulas (curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana]
  );
  return result.rows[0];
}

async function atualizarAula(id, curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana) {
  const result = await pool.query(
    `UPDATE aulas
     SET curso_id = $1, turma_id = $2, professor_id = $3, materia_id = $4, sala_id = $5, horario_id = $6, dia_semana = $7
     WHERE id = $8 RETURNING *`,
    [curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana, id]
  );
  return result.rows[0];
}

async function deletarAula(id) {
  await pool.query('DELETE FROM aulas WHERE id = $1', [id]);
}

async function listarAulasPorSala(dia_semana) {
  const result = await pool.query(`
    SELECT 
      s.id AS sala_id,
      s.nome AS sala_nome,
      s.andar,
      a.id AS aula_id,
      a.dia_semana,
      h.hora_inicio,
      h.hora_fim,
      m.nome AS materia,
      p.nome AS professor,
      t.nome AS turma,
      c.nome AS curso
    FROM aulas a
    JOIN salas s ON a.sala_id = s.id
    JOIN horarios h ON a.horario_id = h.id
    LEFT JOIN materias m ON a.materia_id = m.id
    LEFT JOIN professores p ON a.professor_id = p.id
    JOIN turmas t ON a.turma_id = t.id
    JOIN cursos c ON a.curso_id = c.id
    WHERE a.dia_semana = $1
    ORDER BY s.nome, h.hora_inicio
  `, [dia_semana]);

  return result.rows;
}


module.exports = {
  listarAulas,
  obterAula,
  criarAula,
  atualizarAula,
  deletarAula,
  listarAulasPorSala
};
