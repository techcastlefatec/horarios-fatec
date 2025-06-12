const model = require('../models/salasModel-public');
const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

async function aulasPorSalaHoje(req, res) {
  const { sala_id } = req.params;
  const hoje = new Date();
  const diaAtual = diasSemana[hoje.getDay()];

  try {
    const aulas = await model.obterAulasPorSalaEDia(sala_id, diaAtual);
    if (!aulas.length) {
      return res.status(404).json({ 
        mensagem: 'Nenhuma aula nesta sala hoje' });
    }
    res.json(aulas);
  } catch (error) {
    console.error('Erro ao buscar aulas por sala:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar aulas da sala' });
  }
}

async function listarSalas(req, res) {
  try {
    const listaSalas = await model.listarSalas();
    if (!listaSalas || listaSalas.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma sala encontrada' });
    }
    res.json(listaSalas);
  } catch (error) {
    console.error('Erro ao listar salas:', error);
    res.status(500).json({ erro: 'Erro interno ao listar salas' });
  }
}

async function obterSala(req, res) {
  const { id } = req.params;

  try {
    const sala = await model.obterSala(id);
    if (!sala) {
      return res.status(404).json({ erro: 'Sala não encontrada' });
    }
    res.json(sala);
  } catch (error) {
    console.error('Erro ao obter sala:', error);
    res.status(500).json({ erro: 'Erro interno ao obter sala' });
  }
}


module.exports = {
    aulasPorSalaHoje,
    listarSalas,
    obterSala
  };