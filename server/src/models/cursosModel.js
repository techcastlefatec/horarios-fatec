const pool = require('../config/db');

async function listarCursos() {
  const result = await pool.query('SELECT * FROM cursos ORDER BY id');
  return result.rows;
}

async function obterCurso(id) {
  const result = await pool.query('SELECT * FROM cursos WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarCurso(nome) {
  const result = await pool.query('INSERT INTO cursos (nome) VALUES ($1) RETURNING *', [nome]);
  return result.rows[0];
}

async function atualizarCurso(id, nome) {
  const result = await pool.query('UPDATE cursos SET nome = $1 WHERE id = $2 RETURNING *', [nome, id]);
  return result.rows[0];
}

async function deletarCurso(id) {
  await pool.query('DELETE FROM cursos WHERE id = $1', [id]);
}

module.exports = {
  listarCursos,
  obterCurso,
  criarCurso,
  atualizarCurso,
  deletarCurso
};
