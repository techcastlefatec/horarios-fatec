const pool = require('../config/db');

// Lista todos os professores com suas matérias
async function listarProfessoresComMaterias() {
  const result = await pool.query(`
    SELECT
      p.id,
      p.nome,
      p.email,
      p.foto,
      ARRAY_AGG(DISTINCT m.nome) FILTER (WHERE m.nome IS NOT NULL) AS materias
    FROM professores p
    LEFT JOIN aulas a ON a.professor_id = p.id
    LEFT JOIN materias m ON a.materia_id = m.id
    GROUP BY p.id, p.nome, p.email, p.foto
    ORDER BY p.nome
  `);
  return result.rows;
}

// Busca professor individualmente por ID com suas matérias
async function buscarProfessorPorId(id) {
  const result = await pool.query(`
    SELECT
      p.id,
      p.nome,
      p.email,
      p.foto,
      ARRAY_AGG(DISTINCT m.nome) FILTER (WHERE m.nome IS NOT NULL) AS materias
    FROM professores p
    LEFT JOIN aulas a ON a.professor_id = p.id
    LEFT JOIN materias m ON a.materia_id = m.id
    WHERE p.id = $1
    GROUP BY p.id, p.nome, p.email, p.foto
  `, [id]);

  return result.rows[0] || null;
}

module.exports = {
  listarProfessoresComMaterias,
  buscarProfessorPorId
};
