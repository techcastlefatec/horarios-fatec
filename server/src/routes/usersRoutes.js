const express = require('express');
const router = express.Router();
const { login } = require('../controllers/usersController');
const { logout } = require('../controllers/usersController');
const { checkSession } = require('../controllers/usersController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/session', checkSession);

module.exports = router;