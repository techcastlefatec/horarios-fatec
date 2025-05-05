const pool = require('../config/db');

async function listarSalas() {
  const result = await pool.query('SELECT * FROM salas ORDER BY id');
  return result.rows;
}

async function obterSala(id) {
  const result = await pool.query('SELECT * FROM salas WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarSala(nome, andar) {
  const result = await pool.query('INSERT INTO salas (nome, andar) VALUES ($1, $2) RETURNING *', [nome, andar]);
  return result.rows[0];
}

async function atualizarSala(id, nome, andar) {
  const result = await pool.query('UPDATE salas SET nome = $1, andar = $2 WHERE id = $3 RETURNING *', [nome, andar, id]);
  return result.rows[0];
}

async function deletarSala(id) {
  await pool.query('DELETE FROM salas WHERE id = $1', [id]);
}

module.exports = {
  listarSalas,
  obterSala,
  criarSala,
  atualizarSala,
  deletarSala
};