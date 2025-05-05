const model = require('../models/professoresModel-public'); 

// Lista todos os professores com suas matérias
async function listarProfessores(req, res) {
  try {
    const professores = await model.listarProfessoresComMaterias();
    res.json(professores);
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ erro: 'Erro interno ao listar professores' });
  }
}

// Busca um professor por ID, com suas matérias
async function buscarProfessorPorId(req, res) {
  const { id } = req.params;

  try {
    const professor = await model.buscarProfessorPorId(id);

    if (!professor) {
      return res.status(404).json({ erro: 'Professor não encontrado' });
    }

    res.json(professor);
  } catch (error) {
    console.error('Erro ao buscar professor por ID:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar professor' });
  }
}

module.exports = {
  listarProfessores,
  buscarProfessorPorId
};
