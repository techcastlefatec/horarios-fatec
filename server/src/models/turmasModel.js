const pool = require('../config/db');

async function listarTurmas() {
  const result = await pool.query('SELECT * FROM turmas ORDER BY id');
  return result.rows;
}

async function obterTurma(id) {
  const result = await pool.query('SELECT * FROM turmas WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarTurma(nome, periodo, curso_id) {
  const result = await pool.query(
    'INSERT INTO turmas (nome, periodo, curso_id) VALUES ($1, $2, $3) RETURNING *',
    [nome, periodo, curso_id]
  );
  return result.rows[0];
}

async function atualizarTurma(id, nome, periodo, curso_id) {
  const result = await pool.query(
    'UPDATE turmas SET nome = $1, periodo = $2, curso_id = $3 WHERE id = $4 RETURNING *',
    [nome, periodo, curso_id, id]
  );
  return result.rows[0];
}

async function deletarTurma(id) {
  await pool.query('DELETE FROM turmas WHERE id = $1', [id]);
}

module.exports = {
  listarTurmas,
  obterTurma,
  criarTurma,
  atualizarTurma,
  deletarTurma
};
