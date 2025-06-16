// server/src/controllers/usersController.js
const model = require('../models/usersModel');
// const bcrypt = require('bcryptjs'); // Mantendo comentado por enquanto, foco é o cookie

async function login(req, res) {
    const { email, senha } = req.body;

    try {
        console.log('--- Tentativa de Login ---');
        console.log('Email recebido:', email);

        const user = await model.getUserByEmail(email);

        // ATENÇÃO: Ainda usando comparação de senha em texto puro.
        // Lembrar de implementar bcryptjs depois que a sessão funcionar.
        if (!user || user.senha !== senha) {
            console.log('Login falhou: Email ou senha incorretos.');
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        console.log('Login bem-sucedido para:', user.email);

        // Salvar dados do usuário na sessão
        req.session.usuario = {
            id: user.id,
            nome: user.nome,
            email: user.email
        };

        // *************** LOGS DE DEPURACAO AQUI ***************
        console.log('Dados da sessão definidos:', req.session.usuario);
        console.log('Session ID após definir usuario:', req.sessionID);
        // O express-session só define o cookie na resposta após a sessão ser modificada.
        // A linha abaixo forçaria o save, mas geralmente não é necessário pois ele auto-salva ao final da requisição.
        // req.session.save((err) => {
        //     if (err) console.error('Erro ao salvar sessão explicitamente:', err);
        // });
        // *************** FIM DOS LOGS DE DEPURACAO ***************

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            usuario: req.session.usuario
        });
    } catch (error) {
        console.error('Erro interno no login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

async function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.clearCookie('connect.sid'); // limpa o cookie de sessão
        console.log('Sessão destruída e cookie limpo.');
        return res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
    });
}

async function checkSession(req, res) {
    console.log('--- Checando Sessão (/api/users/session) ---');
    console.log('Session ID recebido:', req.sessionID);
    console.log('Dados da sessão em checkSession:', req.session.usuario);

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