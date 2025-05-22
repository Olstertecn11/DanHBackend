const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const Log = require('../models/LogsModel'); // ✅ importar modelo de logs

// 🔐 Generar token
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, correo: usuario.correo, id_rol: usuario.id_rol },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
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
      // ✅ Log de intento fallido
      await Log.create({
        id_usuario: 0,
        accion: 'Login fallido',
        detalles: `Intento de acceso con correo: ${correo} (contraseña incorrecta)`
      });

      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = generarToken(usuario);
    res.cookie('token', token, { httpOnly: true });

    // ✅ Log de login exitoso
    await Log.create({
      id_usuario: usuario._id,
      accion: 'Login exitoso',
      detalles: `El usuario ${usuario.Nombre} inició sesión`
    });

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
const logout = async (req, res) => {
  try {
    const usuario = req.usuario;
    if (usuario) {
      // ✅ Log de cierre de sesión
      await Log.create({
        id_usuario: usuario.id || 0,
        accion: 'Logout',
        detalles: `El usuario con ID ${usuario.id} cerró sesión`
      });
    }

    res.clearCookie('token');
    res.json({ mensaje: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al cerrar sesión', error: error.message });
  }
};

// Obtener info de usuario autenticado
const getUserInfo = (req, res) => {
  if (!req.user && !req.usuario) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }

  const userData = req.user || req.usuario;
  res.json(userData);
};

module.exports = {
  login,
  verificarToken,
  logout,
  getUserInfo
};
