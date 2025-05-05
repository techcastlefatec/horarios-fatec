const { getUserByEmail } = require('../models/usersModel');

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user || user.senha !== senha) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    res.json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

module.exports = {
  login
};