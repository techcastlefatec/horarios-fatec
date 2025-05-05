const model = require('../models/cursosModel');

async function listar(req, res) {
  const cursos = await model.listarCursos();
  res.json(cursos);
}

async function obter(req, res) {
  const curso = await model.obterCurso(req.params.id);
  if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
  res.json(curso);
}

async function criar(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

  const novo = await model.criarCurso(nome);
  res.status(201).json(novo);
}

async function atualizar(req, res) {
  const { nome } = req.body;
  const { id } = req.params;

  const atualizado = await model.atualizarCurso(id, nome);
  if (!atualizado) return res.status(404).json({ erro: 'Curso não encontrado' });
  res.json(atualizado);
}

async function deletar(req, res) {
  await model.deletarCurso(req.params.id);
  res.status(204).send(); // No Content
}

module.exports = {
  listar, obter, criar, atualizar, deletar
};
