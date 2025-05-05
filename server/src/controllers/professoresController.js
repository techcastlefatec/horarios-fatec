const model = require('../models/professoresModel');

async function listar(req, res) {
  const professores = await model.listarProfessores();
  res.json(professores);
}

async function obter(req, res) {
  const professor = await model.obterProfessor(req.params.id);
  if (!professor) return res.status(404).json({ erro: 'Professor não encontrado' });
  res.json(professor);
}

async function criar(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
  const { email } = req.body;
  const { foto } = req.body;
  const novo = await model.criarProfessor(nome, email, foto);
  res.status(201).json(novo);
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome } = req.body;
  const { email } = req.body;
  const { foto } = req.body;
  const atualizado = await model.atualizarProfessor(id, nome, email, foto);
  if (!atualizado) return res.status(404).json({ erro: 'Professor não encontrado' });
  res.json(atualizado);
}

async function deletar(req, res) {
  await model.deletarProfessor(req.params.id);
  res.status(204).send();
}

module.exports = {
  listar, obter, criar, atualizar, deletar
};