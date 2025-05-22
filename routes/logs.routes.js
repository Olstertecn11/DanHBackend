const express = require('express');
const router = express.Router();
const { crearLog, obtenerLogs } = require('../controllers/logs.controller');

// Ruta para crear un log
router.post('/', crearLog);

// Ruta para obtener todos los logs
router.get('/', obtenerLogs);

module.exports = router;
