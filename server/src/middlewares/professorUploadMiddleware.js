const multer = require('multer');
const path = require('path');

// CORREÇÃO DO CAMINHO:
// __dirname aqui é '.../horarios-fatec/server/src/middlewares'
// '../'  -> '.../horarios-fatec/server/src'
// '../'  -> '.../horarios-fatec/server'
// '../'  -> '.../horarios-fatec' (Agora estamos na raiz do projeto 'horarios-fatec')
// 'front/images/professores' -> '.../horarios-fatec/front/images/professores'
const UPLOAD_DIR = path.join(__dirname, '../../../front/images/professores');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
};

const uploadProfessorPhoto = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024 
    }
});

module.exports = uploadProfessorPhoto;