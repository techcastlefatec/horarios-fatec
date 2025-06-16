const pool = require('../config/db');
const { addMinutes } = require('date-fns');

function normalizarTexto(txt) {
  if (typeof txt === 'string') return txt.trim();
  if (typeof txt === 'number') return txt.toString().trim();
  return '';
}

async function obterIdOuCriar(client, tabela, campo, valor, dadosExtras = {}) {
  const nomeNormalizado = normalizarTexto(valor);
  const result = await client.query(`SELECT id FROM ${tabela} WHERE ${campo} = $1`, [nomeNormalizado]);

  if (result.rowCount > 0) return result.rows[0].id;

  const campos = [campo, ...Object.keys(dadosExtras)];
  const valores = [nomeNormalizado, ...Object.values(dadosExtras)];
  const params = campos.map((_, i) => `$${i + 1}`).join(', ');

  const insert = await client.query(
    `INSERT INTO ${tabela} (${campos.join(', ')}) VALUES (${params}) RETURNING id`,
    valores
  );

  return insert.rows[0].id;
}

async function processarLinha(linha) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const cursoNome = normalizarTexto(linha.curso);
    const turmaNome = normalizarTexto(linha.turma);
    const professorNome = normalizarTexto(linha.professor);
    const materiaNome = normalizarTexto(linha.materia);
    const salaNome = normalizarTexto(linha.sala);
    let horarioInicio = normalizarTexto(linha.horario); // Agora let, para podermos alterar abaixo
    const diaSemana = normalizarTexto(linha['dia da semana']);

    const diasValidos = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    if (!diasValidos.includes(diaSemana)) {
      await client.query('ROLLBACK');
      return { erro: `Dia da semana inválido: "${diaSemana}". Valores permitidos: ${diasValidos.join(', ')}` };
    }

    // Se vier em formato decimal (ex: 0.333), tenta converter para HH:MM
    if (/^\d+(\.\d+)?$/.test(horarioInicio)) {
      const excelHora = parseFloat(horarioInicio);
      const totalMinutos = Math.round(excelHora * 24 * 60);
      const h = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
      const m = (totalMinutos % 60).toString().padStart(2, '0');
      horarioInicio = `${h}:${m}`;
    }

    // Validação do formato HH:MM
    const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!horarioRegex.test(horarioInicio)) {
      await client.query('ROLLBACK');
      return { erro: `Formato de horário inválido: "${horarioInicio}". Esperado HH:MM (ex: 08:00).` };
    }

    const curso = await client.query('SELECT id FROM cursos WHERE nome = $1', [cursoNome]);
    if (curso.rowCount === 0) {
      await client.query('ROLLBACK');
      return { erro: `Curso "${cursoNome}" não encontrado no banco de dados.` };
    }
    const cursoId = curso.rows[0].id;

    let turma = await client.query('SELECT id FROM turmas WHERE nome = $1 AND curso_id = $2', [turmaNome, cursoId]);
    let turmaId;
    if (turma.rowCount > 0) {
      turmaId = turma.rows[0].id;
    } else {
      const insert = await client.query(
        'INSERT INTO turmas (nome, curso_id) VALUES ($1, $2) RETURNING id',
        [turmaNome, cursoId]
      );
      turmaId = insert.rows[0].id;
    }

    const professorId = await obterIdOuCriar(client, 'professores', 'nome', professorNome);
    const materiaId = await obterIdOuCriar(client, 'materias', 'nome', materiaNome);
    const salaId = await obterIdOuCriar(client, 'salas', 'nome', salaNome);

    let horario = await client.query('SELECT id FROM horarios WHERE hora_inicio = $1', [horarioInicio]);
    let horarioId;
    if (horario.rowCount > 0) {
      horarioId = horario.rows[0].id;
    } else {
      const [h, m] = horarioInicio.split(':').map(Number);
      const horaFim = addMinutes(new Date(0, 0, 0, h, m), 50).toTimeString().slice(0, 5);

      const insert = await client.query(
        'INSERT INTO horarios (hora_inicio, hora_fim) VALUES ($1, $2) RETURNING id',
        [horarioInicio, horaFim]
      );
      horarioId = insert.rows[0].id;
    }

    const aulaExistente = await client.query(
      `SELECT id FROM aulas 
       WHERE curso_id = $1 AND turma_id = $2 AND professor_id = $3 AND materia_id = $4 
       AND sala_id = $5 AND horario_id = $6 AND dia_semana = $7`,
      [cursoId, turmaId, professorId, materiaId, salaId, horarioId, diaSemana]
    );

    if (aulaExistente.rowCount > 0) {
      await client.query('ROLLBACK');
      return { erro: `Aula já existente para ${materiaNome} na ${turmaNome} (${diaSemana}) com este horário e professor.` };
    }

    await client.query(
      `INSERT INTO aulas (curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [cursoId, turmaId, professorId, materiaId, salaId, horarioId, diaSemana]
    );

    await client.query('COMMIT');
    return { sucesso: `${materiaNome} - ${turmaNome} (${diaSemana})` };

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao processar linha no banco de dados:', err);
    return { erro: `Erro ao processar dados da aula: ${err.message || 'Erro desconhecido.'}` };
  } finally {
    client.release();
  }
}

module.exports = { processarLinha };
