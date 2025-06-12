const express = require('express');
const router = express.Router();
const controller = require('../controllers/salasController-public');

// Exemplo: /api/public/salas/1/aulas-hoje
router.get('/:sala_id/aulas-hoje', controller.aulasPorSalaHoje);
router.get('/', controller.listarSalas);
router.get('/:id', controller.obterSala);

module.exports = router;