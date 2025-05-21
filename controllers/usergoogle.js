// authController.js
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require("../model/usermodel"); 

// Controlador para iniciar sesión
exports.loginUser = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const user = await User.findOne({ correo });
        if (user && bcrypt.compareSync(password, user.password)) {
            if (user.twoFactorEnabled) {
                res.json({ success: true, twoFactorEnabled: true });
            } else {
                res.json({ success: true, twoFactorEnabled: false });
            }
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

// Controlador para configurar 2FA y generar código QR
exports.setup2FA = async (req, res) => {
    try {
        const user = await User.findOne({ correo: req.session.correo });

        if (user.twoFactorEnabled) {
            return res.json({ success: true, message: '2FA ya está habilitado' });
        }

        const secret = speakeasy.generateSecret({ name: `MyApp (${req.session.correo})` });
        req.session.tempSecret = secret.base32;

        const qrCodeURL = await qrcode.toDataURL(secret.otpauth_url);
        res.json({ success: true, qrCodeURL });
    } catch (error) {
        console.error('Error durante la configuración de 2FA:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

// Controlador para verificar el código 2FA y habilitarlo
exports.verifySetup2FA = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ correo: req.session.correo });
        const verified = speakeasy.totp.verify({
            secret: req.session.tempSecret,
            encoding: 'base32',
            token
        });

        if (verified) {
            user.twoFactorEnabled = true;
            user.twoFactorSecret = req.session.tempSecret;
            await user.save();
            res.json({ success: true, message: '2FA habilitado exitosamente' });
        } else {
            res.status(401).json({ success: false, message: 'Código de 2FA inválido' });
        }
    } catch (error) {
        console.error('Error al verificar el código 2FA:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

// Controlador para verificar el código de 2FA en cada inicio de sesión
exports.verify2FA = async (req, res) => {
    const { correo, token } = req.body;
    try {
        const user = await User.findOne({ correo });
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token
        });

        if (verified) {
            res.json({ success: true, message: '2FA verificado' });
        } else {
            res.status(401).json({ success: false, message: 'Código de 2FA inválido' });
        }
    } catch (error) {
        console.error('Error al verificar el código 2FA:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};


