const model = require('../models/aulasModel');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const stream = require('stream');

async function listar(req, res) {
  const aulas = await model.listarAulas();
  res.json(aulas);
}

async function obter(req, res) {
  const aula = await model.obterAula(req.params.id);
  if (!aula) return res.status(404).json({ erro: 'Aula não encontrada' });
  res.json(aula);
}

async function criar(req, res) {
  const { curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana } = req.body;
  if (!curso_id || !turma_id || !materia_id || !horario_id || !dia_semana)
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });

  const nova = await model.criarAula(curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana);
  res.status(201).json(nova);
}

async function atualizar(req, res) {
  const { curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana } = req.body;
  const { id } = req.params;

  const atualizada = await model.atualizarAula(id, curso_id, turma_id, professor_id, materia_id, sala_id, horario_id, dia_semana);
  if (!atualizada) return res.status(404).json({ erro: 'Aula não encontrada' });
  res.json(atualizada);
}

async function deletar(req, res) {
  await model.deletarAula(req.params.id);
  res.status(204).send();
}


async function listarAulasPorSala(req, res) {
  const { dia_semana, formato } = req.query;

  const diasValidos = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  if (!diasValidos.includes(dia_semana)) {
    return res.status(400).json({ erro: 'Dia da semana inválido. Use: Segunda, Terça, Quarta, Quinta ou Sexta.' });
  }

  const dados = await model.listarAulasPorSala(dia_semana);

  if (!['csv', 'xlsx', 'pdf', undefined].includes(formato)) {
    return res.status(400).json({ erro: 'Formato inválido. Use: csv, xlsx ou pdf.' });
  }

  if (!formato) {
    return res.json(dados);
  }

  // --- CSV ---
  if (formato === 'csv') {
    const parser = new Parser();
    const csv = parser.parse(dados);
    res.header('Content-Type', 'text/csv');
    res.attachment(`aulas-${dia_semana}.csv`);
    return res.send(csv);
  }

  // --- XLSX ---
  if (formato === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Aulas - ${dia_semana}`);

    sheet.columns = [
      { header: 'Sala', key: 'sala_nome', width: 20 },
      { header: 'Andar', key: 'andar', width: 15 },
      { header: 'Horário', key: 'horario', width: 20 },
      { header: 'Matéria', key: 'materia', width: 25 },
      { header: 'Professor', key: 'professor', width: 25 },
      { header: 'Turma', key: 'turma', width: 15 },
      { header: 'Curso', key: 'curso', width: 25 }
    ];

    dados.forEach(row => {
      sheet.addRow({
        sala_nome: row.sala_nome,
        andar: row.andar,
        horario: `${row.hora_inicio} - ${row.hora_fim}`,
        materia: row.materia,
        professor: row.professor,
        turma: row.turma,
        curso: row.curso
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=aulas-${dia_semana}.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  }

  // --- PDF ---
  if (formato === 'pdf') {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const filename = `aulas-${dia_semana}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(16).text(`Aulas por Sala - ${dia_semana}`, { align: 'center' });
    doc.moveDown();

    dados.forEach((linha, i) => {
      doc.fontSize(12).text(`Sala: ${linha.sala_nome} (${linha.andar})`);
      doc.text(`Horário: ${linha.hora_inicio} - ${linha.hora_fim}`);
      doc.text(`Matéria: ${linha.materia}`);
      doc.text(`Professor: ${linha.professor}`);
      doc.text(`Turma: ${linha.turma}`);
      doc.text(`Curso: ${linha.curso}`);
      doc.moveDown();
      if (i % 4 === 3) doc.addPage(); // quebra a cada 4 registros
    });

    doc.end();
  }
}

module.exports = {
  listar, obter, criar, atualizar, deletar, listarAulasPorSala
};

/*
Exemplo de rota para listar aulas por sala em um dia específico em diferentes formatos:
JSON Padrão:
GET api/aulas/por-sala?dia_semana=Quarta
CSV:
GET api/aulas/por-sala?dia_semana=Quarta&formato=csv
XLSX:
GET api/aulas/por-sala?dia_semana=Quarta&formato=xlsx
PDF:
GET api/aulas/por-sala?dia_semana=Quarta&formato=pdf
*/