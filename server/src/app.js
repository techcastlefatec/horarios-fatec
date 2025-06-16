// src/app.js
const express = require('express');
const session = require("express-session");
const path = require('path');
const app = express();

const pool = require('./config/db'); 
const pgSession = require('connect-pg-simple')(session);

require('dotenv').config({path: './.env'});

// Middleware para analisar corpos de requisição JSON
app.use(express.json());

// ** Configuração da sessão usando PostgreSQL para persistência **
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || 'a9Xb72cLqW4mN0pZrT6vYdUs',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/' // <--- ADICIONE ESTA LINHA para garantir o path correto do cookie
    } 
}));

// Importação das rotas
const usersRoutes = require('./routes/usersRoutes');
const cursosRoutes = require('./routes/cursosRoutes');
const turmasRoutes = require('./routes/turmasRoutes');
const materiasRoutes = require('./routes/materiasRoutes');
const professoresRoutes = require('./routes/professoresRoutes');
const horariosRoutes = require('./routes/horariosRoutes');
const aulasRoutes = require('./routes/aulasRoutes');
const quadroRoutepublic = require('./routes/quadroRoute-public');
const professoresRoutepublic = require('./routes/professoresRoute-public');
const salasRoutepublic = require('./routes/salasRoute-public');
const salasRoute = require('./routes/salasRoutes');
const uploadsRoutes = require('./routes/uploadsRoutes');

// Aplicação das rotas
app.use('/api/users', usersRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/turmas', turmasRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/aulas', aulasRoutes); 
app.use('/api/public/quadro-public', quadroRoutepublic);
app.use('/api/public/professores-public', professoresRoutepublic);
app.use('/api/public/salas-public', salasRoutepublic);
app.use('/api/salas', salasRoute);
app.use('/api/uploads', uploadsRoutes);


// Rota simples para testar conexão com o banco de dados
app.get('/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'OK', time: result.rows[0].now });
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        res.status(500).json({ error: 'Erro na conexão com o banco' });
    }
});


// Configuração do diretório estático para servir arquivos front-end
app.use(express.static(path.join(__dirname, '../../front')));

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
