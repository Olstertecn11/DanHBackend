const TwoFAToken = require('../models/TwoFaTokenModel');
const User = require('../models/UserModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "olstertecn597@gmail.com",
    pass: "nmkj jgxk otzu jqrf"
  },
  debug: true,
});

// 🔹 Crear un nuevo token 2FA para un usuario
const crearToken = async (req, res) => {
  try {
    const { userId } = req.body;

    const usuario = await User.findById(userId);
    if (!usuario || !usuario.correo) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o sin correo' });
    }

    // Generar token hexadecimal de 4 dígitos
    const token = crypto.randomBytes(2).toString('hex').toUpperCase();

    // Eliminar tokens anteriores
    await TwoFAToken.deleteMany({ userId });

    // Crear y guardar nuevo token
    const nuevoToken = await TwoFAToken.create({ userId, token });

    // Enviar correo con el token
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: usuario.correo,
      subject: 'Código de verificación 2FA',
      html: `
        <p>Hola <strong>${usuario.Nombre}</strong>,</p>
        <p>Tu código de verificación es:</p>
        <h2 style="font-size: 28px; color: #2e86de;">${token}</h2>
        <p>Este código es válido por un corto periodo. Si no lo solicitaste, ignora este mensaje.</p>
        <p style="font-size: 13px;">— Equipo de Seguridad</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ mensaje: 'Token 2FA creado y enviado por correo', token: nuevoToken });
  } catch (error) {
    console.error('Error al crear y enviar token:', error);
    res.status(500).json({ mensaje: 'Error al generar token', error: error.message });
  }
};

const buscarPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const token = await TwoFAToken.findOne({ userId });
    if (!token) return res.status(404).json({ mensaje: 'Token no encontrado' });
    res.json(token);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar token', error: error.message });
  }
};

const buscarPorToken = async (req, res) => {
  try {
    const { codigo: token } = req.params;
    const tokenEncontrado = await TwoFAToken.findOne({ token: token.toUpperCase() });
    if (!tokenEncontrado) return res.status(404).json({ mensaje: 'Token no encontrado' });
    res.json(tokenEncontrado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al buscar token', error: error.message });
  }
};

const eliminarPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await TwoFAToken.deleteMany({ userId });
    res.json({ mensaje: 'Tokens eliminados', eliminados: result.deletedCount });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar token', error: error.message });
  }
};

const eliminarPorToken = async (req, res) => {
  try {
    const { token } = req.params;
    const result = await TwoFAToken.deleteOne({ token: token.toUpperCase() });
    if (result.deletedCount === 0) return res.status(404).json({ mensaje: 'Token no encontrado' });
    res.json({ mensaje: 'Token eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar token', error: error.message });
  }
};

module.exports = {
  crearToken,
  buscarPorUsuario,
  buscarPorToken,
  eliminarPorToken,
  eliminarPorUsuario
};
