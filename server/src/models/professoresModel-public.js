const pool = require('../config/db');

// Lista todos os professores com suas matérias, cursos e turmas
async function listarProfessoresComMaterias() {
  const result = await pool.query(`
    SELECT
      p.id,
      p.nome,
      p.email,
      p.foto,
      ARRAY_AGG(DISTINCT m.nome) FILTER (WHERE m.nome IS NOT NULL) AS materias,
      ARRAY_AGG(DISTINCT c.nome) FILTER (WHERE c.nome IS NOT NULL) AS cursos,
      ARRAY_AGG(DISTINCT t.nome) FILTER (WHERE t.nome IS NOT NULL) AS turmas
    FROM professores p
    LEFT JOIN aulas a ON a.professor_id = p.id
    LEFT JOIN materias m ON a.materia_id = m.id
    LEFT JOIN cursos c ON a.curso_id = c.id
    LEFT JOIN turmas t ON a.turma_id = t.id
    GROUP BY p.id, p.nome, p.email, p.foto
    ORDER BY p.nome
  `);

  return result.rows;
}

// Busca professor individualmente por ID com suas matérias, cursos e turmas
async function buscarProfessorPorId(id) {
  const result = await pool.query(`
    SELECT
      p.id,
      p.nome,
      p.email,
      p.foto,
      ARRAY_AGG(DISTINCT m.nome) FILTER (WHERE m.nome IS NOT NULL) AS materias,
      ARRAY_AGG(DISTINCT c.nome) FILTER (WHERE c.nome IS NOT NULL) AS cursos,
      ARRAY_AGG(DISTINCT t.nome) FILTER (WHERE t.nome IS NOT NULL) AS turmas
    FROM professores p
    LEFT JOIN aulas a ON a.professor_id = p.id
    LEFT JOIN materias m ON a.materia_id = m.id
    LEFT JOIN cursos c ON a.curso_id = c.id
    LEFT JOIN turmas t ON a.turma_id = t.id
    WHERE p.id = $1
    GROUP BY p.id, p.nome, p.email, p.foto
  `, [id]);

  return result.rows[0] || null;
}

module.exports = {
  listarProfessoresComMaterias,
  buscarProfessorPorId
};
