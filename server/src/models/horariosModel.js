const pool = require('../config/db');

async function listarHorarios() {
  const result = await pool.query('SELECT * FROM horarios ORDER BY id');
  return result.rows;
}

async function obterHorario(id) {
  const result = await pool.query('SELECT * FROM horarios WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarHorario(hora_inicio, hora_fim) {
  const result = await pool.query(
    'INSERT INTO horarios (hora_inicio, hora_fim) VALUES ($1, $2) RETURNING *',
    [hora_inicio, hora_fim]
  );
  return result.rows[0];
}

async function atualizarHorario(id, hora_inicio, hora_fim) {
  const result = await pool.query(
    'UPDATE horarios SET hora_inicio = $1, hora_fim = $2 WHERE id = $3 RETURNING *',
    [hora_inicio, hora_fim, id]
  );
  return result.rows[0];
}

async function deletarHorario(id) {
  await pool.query('DELETE FROM horarios WHERE id = $1', [id]);
}

module.exports = {
  listarHorarios,
  obterHorario,
  criarHorario,
  atualizarHorario,
  deletarHorario
};
