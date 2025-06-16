const model = require('../models/usersModel');

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const user = await model.getUserByEmail(email);

    if (!user || user.senha !== senha) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Salvar dados do usuário na sessão
    req.session.usuario = {
      id: user.id,
      nome: user.nome,
      email: user.email
    };

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}


async function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.clearCookie('connect.sid'); // limpa o cookie de sessão
    return res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
  });
}


async function checkSession(req, res) {
  if (req.session && req.session.usuario) {
    res.json({ usuario: req.session.usuario });
  } else {
    res.json({ usuario: null });
  }
}

module.exports = {
  login,
  logout,
  checkSession
};