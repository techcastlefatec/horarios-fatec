const model = require('../models/aulasModel');

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

module.exports = {
  listar, obter, criar, atualizar, deletar
};