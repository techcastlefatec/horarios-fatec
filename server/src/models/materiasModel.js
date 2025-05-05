const pool = require('../config/db');

async function listarMaterias() {
  const result = await pool.query('SELECT * FROM materias ORDER BY id');
  return result.rows;
}

async function obterMateria(id) {
  const result = await pool.query('SELECT * FROM materias WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarMateria(nome) {
  const result = await pool.query('INSERT INTO materias (nome) VALUES ($1) RETURNING *', [nome]);
  return result.rows[0];
}

async function atualizarMateria(id, nome) {
  const result = await pool.query('UPDATE materias SET nome = $1 WHERE id = $2 RETURNING *', [nome, id]);
  return result.rows[0];
}

async function deletarMateria(id) {
  await pool.query('DELETE FROM materias WHERE id = $1', [id]);
}

module.exports = {
  listarMaterias,
  obterMateria,
  criarMateria,
  atualizarMateria,
  deletarMateria
};
