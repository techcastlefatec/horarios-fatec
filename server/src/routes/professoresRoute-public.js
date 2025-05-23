const express = require('express');
const router = express.Router();
const controller = require('../controllers/professoresController-public');

// Exemplo: /api/public/professores
router.get('/', controller.listarProfessores);
router.get('/:id', controller.buscarProfessorPorId);

module.exports = router;