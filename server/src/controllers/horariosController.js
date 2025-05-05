const model = require('../models/horariosModel');

async function listar(req, res) {
  const horarios = await model.listarHorarios();
  res.json(horarios);
}

async function obter(req, res) {
  const horario = await model.obterHorario(req.params.id);
  if (!horario) return res.status(404).json({ erro: 'Horário não encontrado' });
  res.json(horario);
}

async function criar(req, res) {
  const { hora_inicio, hora_fim } = req.body;
  if (!hora_inicio || !hora_fim)
    return res.status(400).json({ erro: 'Hora de início e fim são obrigatórias' });

  const novo = await model.criarHorario(hora_inicio, hora_fim);
  res.status(201).json(novo);
}

async function atualizar(req, res) {
  const { hora_inicio, hora_fim } = req.body;
  const { id } = req.params;

  const atualizado = await model.atualizarHorario(id, hora_inicio, hora_fim);
  if (!atualizado) return res.status(404).json({ erro: 'Horário não encontrado' });
  res.json(atualizado);
}

async function deletar(req, res) {
  await model.deletarHorario(req.params.id);
  res.status(204).send();
}

module.exports = {
  listar, obter, criar, atualizar, deletar
};