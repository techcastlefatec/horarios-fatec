const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadsMiddleware');
const controller = require('../controllers/uploadsController');

router.post('/upload-aulas', upload.single('arquivo'), controller.processarUpload);

module.exports = router;
