const express = require('express');
const router = express.Router();

// Importar funciones del controlador
const {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/user.controller');

// Crear un nuevo usuario
router.post('/', crearUsuario);

// Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// Actualizar un usuario por ID
router.put('/:id', actualizarUsuario);

// Eliminar un usuario por ID
router.delete('/:id', eliminarUsuario);

module.exports = router;
