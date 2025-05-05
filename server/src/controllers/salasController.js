const model = require('../models/salasModel');

async function listar(req, res) {
  const salas = await model.listarSalas();
  res.json(salas);
}

async function obter(req, res) {
  const sala = await model.obterSala(req.params.id);
  if (!sala) return res.status(404).json({ erro: 'Sala não encontrada' });
  res.json(sala);
}

async function criar(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
  const { andar } = req.body;
  const nova = await model.criarSala(nome, andar);
  res.status(201).json(nova);
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  const { andar } = req.body;
  const atualizada = await model.atualizarSala(id, nome, andar);
  if (!atualizada) return res.status(404).json({ erro: 'Sala não encontrada' });
  res.json(atualizada);
}

async function deletar(req, res) {
  await model.deletarProfessor(req.params.id);
  res.status(204).send();
}

module.exports = {
  listar, obter, criar, atualizar, deletar
};