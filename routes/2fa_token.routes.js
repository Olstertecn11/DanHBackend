const express = require('express');
const router = express.Router();

const {
  crearToken,
  buscarPorUsuario,
  buscarPorToken,
  eliminarPorToken,
  eliminarPorUsuario
} = require('../controllers/2fa_token.controller');

// Crear token
router.post('/crear', crearToken);

// Buscar token por ID de usuario
router.get('/usuario/:id_usuario', buscarPorUsuario);

// Eliminar token por ID de usuario
router.delete('/usuario/:id_usuario', eliminarPorUsuario);

// Eliminar token por código
router.delete('/codigo/:codigo', eliminarPorToken);

// Buscar token por código
router.get('/codigo/:codigo', buscarPorToken);

module.exports = router;
