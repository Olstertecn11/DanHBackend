const express = require('express');
const router = express.Router();
const {
  login,
  verificarToken,
  logout
} = require('../controllers/auth.controller');

router.post('/login', login);

router.get('/verificar-token', verificarToken);

router.post('/logout', logout);

module.exports = router;
