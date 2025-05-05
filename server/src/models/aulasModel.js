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

module.exports = {
  listarAulas,
  obterAula,
  criarAula,
  atualizarAula,
  deletarAula
};
