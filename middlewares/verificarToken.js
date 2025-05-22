const jwt = require('jsonwebtoken');

module.exports = function verificarToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};
