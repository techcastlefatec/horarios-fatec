const express = require('express');
const router = express.Router();
const controller = require('../controllers/aulasController');

// Rotas mais específicas primeiro
router.get('/por-sala', controller.listarAulasPorSala); 
router.get('/:id', controller.obter); 
router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);


module.exports = router;