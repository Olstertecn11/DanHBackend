const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

// 🔐 Generar token
const generarToken = (usuario) => {
  return jwt.sign({ id: usuario._id, correo: usuario.correo }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// 🟢 Login normal
const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo no registrado' });
    }

    const valido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = generarToken(usuario);
    res.cookie('token', token, { httpOnly: true }); // puedes agregar secure: true si usas HTTPS

    res.json({ mensaje: 'Login exitoso', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

// 🔒 Verificar token
const verificarToken = (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ mensaje: 'Token no encontrado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ mensaje: 'Token válido', usuario: decoded });
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o expirado', error: error.message });
  }
};

// 🔴 Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};

module.exports = {
  login,
  verificarToken,
  logout
};
