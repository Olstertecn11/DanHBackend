const express = require('express');
const router = express.Router();
const {
  crearCierre,
  obtenerCierres,
  actualizarCierre,
  eliminarCierre
} = require('../controllers/cierre_um.controller');
const verificarToken = require('../middlewares/verificarToken');

// Rutas protegidas con token
router.get('/', verificarToken, obtenerCierres);
router.post('/', verificarToken, crearCierre);
router.put('/:id', verificarToken, actualizarCierre);
router.delete('/:id', verificarToken, eliminarCierre);

module.exports = router;
