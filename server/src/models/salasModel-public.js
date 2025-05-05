const pool = require('../config/db');

async function obterAulasPorSalaEDia(sala_id, dia_semana) {
    const result = await pool.query(`
      SELECT
        a.id,
        a.dia_semana,
        h.hora_inicio,
        h.hora_fim,
        m.nome AS materia,
        p.nome AS professor,
        t.nome AS turma
      FROM aulas a
      JOIN horarios h ON a.horario_id = h.id
      JOIN materias m ON a.materia_id = m.id
      JOIN turmas t ON a.turma_id = t.id
      LEFT JOIN professores p ON a.professor_id = p.id
      WHERE a.sala_id = $1 AND a.dia_semana = $2
      ORDER BY h.hora_inicio
    `, [sala_id, dia_semana]);
  
    return result.rows;
  }

  module.exports = {
    obterAulasPorSalaEDia
  };