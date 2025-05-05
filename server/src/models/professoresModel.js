const pool = require('../config/db');

async function listarProfessores() {
  const result = await pool.query('SELECT * FROM professores ORDER BY id');
  return result.rows;
}

async function obterProfessor(id) {
  const result = await pool.query('SELECT * FROM professores WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarProfessor(nome, email, foto) {
  const result = await pool.query('INSERT INTO professores (nome, email, foto) VALUES ($1, $2, $3) RETURNING *', [nome, email, foto]);
  return result.rows[0];
}


async function atualizarProfessor(id, nome, email, foto) {
  const result = await pool.query('UPDATE professores SET nome = $1, email= $2, foto= $3 WHERE id = $4 RETURNING *', [nome, email, foto, id]);
  return result.rows[0];
}

async function deletarProfessor(id) {
  await pool.query('DELETE FROM professores WHERE id = $1', [id]);
}

module.exports = {
  listarProfessores,
  obterProfessor,
  criarProfessor,
  atualizarProfessor,
  deletarProfessor
};
