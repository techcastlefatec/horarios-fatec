const express = require('express');
const router = express.Router();
const controller = require('../controllers/professoresController');
const uploadProfessorPhoto = require('../middlewares/professorUploadMiddleware'); // Importa o middleware de upload

router.get('/', controller.listar);
router.get('/:id', controller.obter);

// Para a rota POST (criar): Use o middleware de upload ANTES do controlador.
// .single('foto') indica que esperamos um único arquivo no campo 'foto' do formulário.
router.post('/', uploadProfessorPhoto.single('foto'), controller.criar);

// Para a rota PUT (atualizar): Também use o middleware de upload.
// Ele processará o arquivo se um novo for enviado.
router.put('/:id', uploadProfessorPhoto.single('foto'), controller.atualizar);

router.delete('/:id', controller.deletar);

module.exports = router;

