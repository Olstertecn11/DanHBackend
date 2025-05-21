const express = require('express');
const router = express.Router();
const registroController = require('../controler/registrocontroles');

// Ruta para crear un nuevo registro
router.post('/createlogs', registroController.crearRegistro);

// Ruta para obtener todos los registros
router.get('/logs', registroController.obtenerRegistros);

// Ruta para obtener registros de un usuario específico
router.get('/log/:id_usuario', registroController.obtenerRegistrosPorUsuario);

module.exports = router;
