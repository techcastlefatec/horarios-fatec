SELECT 
  a.id,
  c.nome AS curso,
  t.nome AS turma,
  p.nome AS professor,
  m.nome AS materia,
  s.nome AS sala,
  h.hora_inicio,
  h.hora_fim,
  a.dia_semana
FROM aulas a
JOIN cursos c ON a.curso_id = c.id
JOIN turmas t ON a.turma_id = t.id
LEFT JOIN professores p ON a.professor_id = p.id
LEFT JOIN materias m ON a.materia_id = m.id
LEFT JOIN salas s ON a.sala_id = s.id
JOIN horarios h ON a.horario_id = h.id
ORDER BY a.id;
  