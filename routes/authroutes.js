// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controler/usergoogle'); // Asegúrate de que la ruta es correcta

// Ruta para iniciar sesión
router.post('/api/login', authController.loginUser);

// Ruta para configurar 2FA y generar código QR
router.get('/api/setup-2fa', authController.setup2FA);

// Ruta para verificar y habilitar 2FA con el código proporcionado
router.post('/api/setup-2fa', authController.verifySetup2FA);

// Ruta para verificar el código 2FA en el inicio de sesión
router.post('/api/verify-2fa', authController.verify2FA);

module.exports = router;

