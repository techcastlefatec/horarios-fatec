const model = require('../models/salasModel-public');
const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

async function aulasPorSalaHoje(req, res) {
  const { sala_id } = req.params;
  const hoje = new Date();
  const diaAtual = diasSemana[hoje.getDay()];

  try {
    const aulas = await model.obterAulasPorSalaEDia(sala_id, diaAtual);
    if (!aulas.length) {
      return res.status(404).json({ mensagem: 'Nenhuma aula nesta sala hoje' });
    }
    res.json(aulas);
  } catch (error) {
    console.error('Erro ao buscar aulas por sala:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar aulas da sala' });
  }
}

module.exports = {
    aulasPorSalaHoje
  };