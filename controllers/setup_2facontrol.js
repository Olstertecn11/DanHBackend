router.post('/setup-2fa', isAuthenticated, async (req, res) => {
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
            await user.save(); // Guarda los cambios en MongoDB
            res.redirect('/inicio');
        } else {
            res.render('/setup-2fa', { error: 'Token inválido, intente de nuevo' });
        }
    } catch (error) {
        console.error(error);
        res.render('/setup-2fa', { error: 'Error al configurar 2FA' });
    }
});

router.get('/setup-2fa', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ correo: req.session.correo });

        if (user.twoFactorEnabled) {
            return res.redirect('/inicio');
        }

        const secret = speakeasy.generateSecret({ name: `MyApp (${req.session.correo})` });
        req.session.tempSecret = secret.base32;

        qrcode.toDataURL(secret.otpauth_url, (err, dataURL) => {
            if (err) throw err;
            res.render('/setup-2fa', { qrCodeURL: dataURL });
        });
    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
});
