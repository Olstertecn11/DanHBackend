const express = require('express');
const router = express.Router();

const {
  login,
  verificarToken: checkToken, // <- Renombramos para no confundir con middleware
  logout,
  getUserInfo
} = require('../controllers/auth.controller');

const verificarToken = require('../middlewares/verificarToken'); // ✅ middleware

// Rutas públicas
router.post('/login', login);
router.get('/verificar-token', checkToken);

// Rutas protegidas
router.post('/logout', verificarToken, logout);
router.post('/user-info', verificarToken, getUserInfo);

module.exports = router;
