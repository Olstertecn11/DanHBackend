const TwoFAToken = require('../models/TwoFaTokenModel');
const User = require('../models/UserModel');
const crypto = require('crypto');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configuración de la API de Brevo (Sendinblue)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const crearToken = async (req, res) => {
  try {
    const { userId } = req.body;

    const usuario = await User.findById(userId);
    if (!usuario || !usuario.correo) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o sin correo' });
    }

    const token = crypto.randomBytes(2).toString('hex').toUpperCase();

    await TwoFAToken.deleteMany({ userId });

    const nuevoToken = await TwoFAToken.create({ userId, token });

    const sendSmtpEmail = {
      sender: { name: "Olster Seguridad", email: "olstertecn597@gmail.com" }, // Debe estar verificado en Brevo
      to: [{ email: usuario.correo, name: usuario.Nombre }],
      subject: 'Código de verificación 2FA',
      htmlContent: `
        <p>Hola <strong>${usuario.Nombre}</strong>,</p>
        <p>Tu código de verificación es:</p>
        <h2 style="font-size: 28px; color: #2e86de;">${token}</h2>
        <p>Este código es válido por un corto periodo. Si no lo solicitaste, ignora este mensaje.</p>
        <p style="font-size: 13px;">— Equipo de Seguridad</p>
      `
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(201).json({ mensaje: 'Token 2FA creado y enviado por correo', token: nuevoToken });
  } catch (error) {
    console.error('Error al crear y enviar token:', error.response?.body || error.message);
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
