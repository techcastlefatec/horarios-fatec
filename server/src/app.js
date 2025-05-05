const express = require('express');
const path = require('path');
const app = express();
const pool = require('./config/db');

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

require('dotenv').config();

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


app.use(express.static(path.join(__dirname, '../../front')));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
   