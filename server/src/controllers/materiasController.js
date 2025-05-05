const model = require('../models/materiasModel');

async function listar(req, res) {
  const materias = await model.listarMaterias();
  res.json(materias);
}

async function obter(req, res) {
  const materia = await model.obterMateria(req.params.id);
  if (!materia) return res.status(404).json({ erro: 'Matéria não encontrada' });
  res.json(materia);
}

async function criar(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

  const nova = await model.criarMateria(nome);
  res.status(201).json(nova);
}

async function atualizar(req, res) {
  const { nome } = req.body;
  const { id } = req.params;

  const atualizada = await model.atualizarMateria(id, nome);
  if (!atualizada) return res.status(404).json({ erro: 'Matéria não encontrada' });
  res.json(atualizada);
}

async function deletar(req, res) {
  await model.deletarMateria(req.params.id);
  res.status(204).send();
}

module.exports = {
  listar, obter, criar, atualizar, deletar
};
