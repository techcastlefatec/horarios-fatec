const pool = require('../config/db');

// As funções do modelo agora aceitam um 'client' como primeiro argumento.
// Isso permite que elas participem de uma transação gerenciada no controlador.

async function listarProfessores() {
  // Para listagem, que é apenas leitura, podemos usar a pool diretamente ou um client temporário.
  // Usar a pool diretamente é mais simples para SELECTs que não fazem parte de uma transação maior.
  const result = await pool.query('SELECT * FROM professores ORDER BY id');
  return result.rows;
}

async function obterProfessor(client, id) {
  // Recebe 'client' para ser consistente se chamado dentro de uma transação.
  const result = await client.query('SELECT * FROM professores WHERE id = $1', [id]);
  return result.rows[0];
}

async function criarProfessor(client, nome, email, foto) {
  // Recebe 'client' para inserção dentro de uma transação.
  const result = await client.query('INSERT INTO professores (nome, email, foto) VALUES ($1, $2, $3) RETURNING *', [nome, email, foto]);
  return result.rows[0];
}

async function atualizarProfessor(client, id, nome, email, foto) {
  // Recebe 'client' para atualização dentro de uma transação.
  const result = await client.query('UPDATE professores SET nome = $1, email = $2, foto = $3 WHERE id = $4 RETURNING *', [nome, email, foto, id]);
  return result.rows[0];
}

async function deletarProfessor(client, id) {
  // Recebe 'client' para exclusão dentro de uma transação.
  await client.query('DELETE FROM professores WHERE id = $1', [id]);
}

module.exports = {
  listarProfessores,
  obterProfessor,
  criarProfessor,
  atualizarProfessor,
  deletarProfessor
};
