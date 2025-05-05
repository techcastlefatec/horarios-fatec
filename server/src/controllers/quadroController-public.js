const model = require('../models/quadroModel-public');

async function quadroHorarios(req, res) {
  const { turma_id } = req.params;

  try {
    const aulas = await model.obterQuadroHorariosPorTurma(turma_id);
    if (!aulas || aulas.length === 0) {
      return res.status(404).json({ erro: 'Nenhuma aula encontrada para esta turma' });
    }
    res.json(aulas);
  } catch (error) {
    console.error('Erro ao obter quadro de horários:', error);
    res.status(500).json({ erro: 'Erro interno ao obter o quadro de horários' });
  }
}

module.exports = {
  quadroHorarios
};
