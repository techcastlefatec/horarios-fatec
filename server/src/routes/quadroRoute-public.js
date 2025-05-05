const express = require('express');
const router = express.Router();
const controller = require('../controllers/quadroController-public');

// Exemplo: /api/public/quadro/1
router.get('/:turma_id', controller.quadroHorarios);

module.exports = router;