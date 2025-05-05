const model = require('../models/turmasModel');

async function listar(req, res) {
  const turmas = await model.listarTurmas();
  res.json(turmas);
}

async function obter(req, res) {
  const turma = await model.obterTurma(req.params.id);
  if (!turma) return res.status(404).json({ erro: 'Turma não encontrada' });
  res.json(turma);
}

async function criar(req, res) {
  const { nome, periodo, curso_id } = req.body;
  if (!nome || !curso_id) return res.status(400).json({ erro: 'Nome e curso_id são obrigatórios' });

  const nova = await model.criarTurma(nome, periodo, curso_id);
  res.status(201).json(nova);
}

async function atualizar(req, res) {
  const { nome, periodo, curso_id } = req.body;
  const { id } = req.params;

  const atualizada = await model.atualizarTurma(id, nome, periodo, curso_id);
  if (!atualizada) return res.status(404).json({ erro: 'Turma não encontrada' });
  res.json(atualizada);
}

async function deletar(req, res) {
  await model.deletarTurma(req.params.id);
  res.status(204).send();
}

module.exports = {
  listar, obter, criar, atualizar, deletar
};