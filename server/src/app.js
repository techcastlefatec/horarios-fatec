// src/app.js
const express = require('express');
const cors = require('cors');
const session = require("express-session");
const path = require('path');
const app = express();

// Importa o pool do banco de dados
const pool = require('./config/db'); 

// ** Importa o session store para PostgreSQL **
const pgSession = require('connect-pg-simple')(session);

// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config({path: './.env'});

// Configuração do CORS
// Se o seu front-end está sendo servido pelo mesmo back-end,
// você pode não precisar do CORS aqui, mas o mantemos por segurança caso haja outras interações.
app.use(cors({
    credentials: true // Importante para permitir o envio de cookies de sessão
}));

// Middleware para analisar corpos de requisição JSON
app.use(express.json());

// ** Configuração da sessão - AGORA USANDO PostgreSQL para persistência **
app.use(session({
    // Configura o armazenamento da sessão para usar o PostgreSQL
    store: new pgSession({
        pool: pool, // Seu pool de conexão do PostgreSQL (do arquivo './config/db')
        tableName: 'session' // Nome da tabela que você criou no seu banco de dados
    }),
    secret: process.env.SESSION_SECRET || 'a9Xb72cLqW4mN0pZrT6vYdUs', // Use uma chave secreta forte e gerada aleatoriamente
    resave: false, // Evita salvar a sessão se ela não foi modificada
    saveUninitialized: false, // Evita criar sessões para usuários não autenticados
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true em produção (HTTPS), false em dev (HTTP)
        httpOnly: true, // Impede acesso ao cookie via JavaScript do lado do cliente
        maxAge: 1000 * 60 * 60 * 24, // 1 dia de duração do cookie (em milissegundos)
        // sameSite: 'None' exige que 'secure' seja true para funcionar.
        // Usamos uma condicional para 'Lax' em desenvolvimento, para que funcione via HTTP localmente.
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
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
// Certifique-se de que o caminho para o frontend está correto
app.use(express.static(path.join(__dirname, '../../front')));

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});