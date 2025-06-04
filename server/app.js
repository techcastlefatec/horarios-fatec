const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const pool = require('./src/config/db');

const usersRoutes = require('./src/routes/usersRoutes');
const cursosRoutes = require('./src/routes/cursosRoutes');
const turmasRoutes = require('./src/routes/turmasRoutes');
const materiasRoutes = require('./src/routes/materiasRoutes');
const professoresRoutes = require('./src/routes/professoresRoutes');
const horariosRoutes = require('./src/routes/horariosRoutes');
const aulasRoutes = require('./src/routes/aulasRoutes');
const quadroRoutepublic = require('./src/routes/quadroRoute-public');
const professoresRoutepublic = require('./src/routes/professoresRoute-public');
const salasRoutepublic = require('./src/routes/salasRoute-public');
const salasRoute = require('./src/routes/salasRoutes');

require('dotenv').config({path: './.env'});

app.use(cors());

app.use(express.json());
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


// Rota simples para testar conexão
app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro na conexão com o banco' });
  }
});


app.use(express.static(path.join(__dirname, '../front')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
   