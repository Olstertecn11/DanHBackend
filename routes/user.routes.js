const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');

// Importar funciones del controlador
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  getUserRole
} = require('../controllers/user.controller');

// Crear un nuevo usuario
router.post('/', verificarToken, crearUsuario);

// Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// Actualizar un usuario por ID
router.put('/:id', verificarToken, actualizarUsuario);

// Eliminar un usuario por ID
router.delete('/:id', verificarToken, eliminarUsuario);

// Obtener rol de un usuario por ID
router.get('/:id/rol', getUserRole)

module.exports = router;
