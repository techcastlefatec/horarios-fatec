function authMiddleware(req, res, next) {
  if (req.session && req.session.usuario) {
    next(); // usuário autenticado, pode continuar
  } else {
    res.status(401).json({ error: 'Acesso não autorizado. Faça login.' });
  }
}

module.exports = authMiddleware;