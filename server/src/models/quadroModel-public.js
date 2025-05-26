const pool = require('../config/db');

async function obterQuadroHorariosPorTurma(turma_id) {
  const result = await pool.query(`
    SELECT
      a.id,
      a.dia_semana,
      h.hora_inicio,
      h.hora_fim,
      m.nome AS materia,
      p.nome AS professor,
      s.nome AS sala,
      t.periodo
    FROM aulas a
    JOIN horarios h ON a.horario_id = h.id
    JOIN materias m ON a.materia_id = m.id
    LEFT JOIN professores p ON a.professor_id = p.id
    LEFT JOIN salas s ON a.sala_id = s.id
    JOIN turmas t ON a.turma_id = t.id
    WHERE a.turma_id = $1
    ORDER BY
      CASE a.dia_semana
        WHEN 'Segunda' THEN 1
        WHEN 'Terça' THEN 2
        WHEN 'Quarta' THEN 3
        WHEN 'Quinta' THEN 4
        WHEN 'Sexta' THEN 5
      END,
      h.hora_inicio
  `, [turma_id]);

  return result.rows;
}

module.exports = {
  obterQuadroHorariosPorTurma
};
