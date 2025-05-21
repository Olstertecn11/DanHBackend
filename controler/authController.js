const User = require("../model/usermodel");
const bcrypt = require("bcrypt");


exports.registerUser = async (req, res) => {
  try {
    const {
      Nombre,
      correo,
      contrasena,
      id_rol,
      twoFactorEnable,
      twoFactorSecret,
      fecha_creacion,
      estado,
      creado_por,
      actualizado_por,
      fecha_actualizado
    } = req.body;

    if (
      !Nombre ||
      !correo ||
      !contrasena ||
      !id_rol ||
      !twoFactorEnable ||
      !twoFactorSecret ||
      !fecha_creacion ||
      !estado ||
      !creado_por ||
      !actualizado_por ||
      !fecha_actualizado
    ) {
      return res
        .status(400)
        .json({ Mensaje: "Por favor, complete todos los campos." });
    }

    if (contrasena !== ValidacionClave) {
      return res.status(400).json({ Mensaje: "Las contraseñas no coinciden." });
    }

    if (contrasena.length < 8) {
      return res
        .status(400)
        .json({ Mensaje: "La contraseña debe tener al menos 8 caracteres." });
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({ Mensaje: "Usuario registrado exitosamente." });
  } catch (error) {
    if (error.code === 11000) {
    } else {
      res.status(500).json({ Mensaje: "Error al registrar el usuario." });
    }
  }
};

exports.loginUser = async (req, res) => {
  try {
    const {correo, contrasena} = req.body;

    const user = await User.findOne({ correo:correo });
    if (!user) {
      return res
        .status(401)
        .json({ Mensaje: "Correo electrónico o contraseña incorrectos." });
    }

    if (contrasena !== user.contrasena) {
      return res
        .status(401)
        .json({ Mensaje: "Correo electrónico o contraseña incorrectos." });
    }

    res.json({ Mensaje: "Inicio de sesión exitoso", user });

  } catch (error) {
    console.log(error);
    res.status(500).json({ Mensaje: "Error al iniciar sesión." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ correo: req.params.correo });
    if (!user)
      return res.status(404).json({ Mensaje: "Usuario no encontrado." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al obtener el perfil." });
  }
};

exports.updateProfile = async (req, res) => {
    const { Nombre, correo, contrasena, estado, actualizado_por, fecha_actualizado } = req.body;

    if (!Nombre || !correo || !contrasena || !estado || !actualizado_por || !fecha_actualizado) {
        return res.status(400).json({ Mensaje: 'Todos los campos son obligatorios.' });
    }

    if (!emailValidator.validate(correo)) {
        return res.status(400).json({ Mensaje: 'El formato del correo electrónico no es válido.' });
    }

    try {
        const emailExists = await User.findOne({ correo, _id: { $ne: req.user.usercorreo } });

        if (emailExists) {
            return res.status(400).json({ Mensaje: 'El correo electrónico ya está registrado.' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { correo: req.params.correo },
            {
                Nombre,
                correo,
                contrasena,
                estado,
                actualizado_por,
                fecha_actualizado
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ Mensaje: 'Usuario no encontrado.' });
        }

        res.json({ Mensaje: 'Perfil actualizado exitosamente.', updatedUser });
    } catch (error) {
        res.status(500).json({ Mensaje: 'Error al actualizar el perfil.' });
    }
};

exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ correo: req.params.correo });
    if (!user)
      return res.status(404).json({ Mensaje: "Usuario no encontrado." });
    res.json({ Mensaje: "Perfil eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al eliminar el perfil." });
  }
};

exports.getProfile = async (req, res) => {
    try {
      const user = await User.findOne({correo:req.params.correo});
      if (!user)
        return res.status(404).json({ Mensaje: "Usuario no encontrado." });
      res.json(user);
    } catch (error) {
      res.status(500).json({ Mensaje: "Error al obtener el perfil." });
    }
  };

exports.getAllRecords = async (req, res) => {
    try {
      const records = await User.find({});
      if (records.length === 0) {
        return res.status(404).json({ Mensaje: "No se encontraron registros." });
      }
      res.json(records);      
    } catch (error) {
      res.status(500).json({ Mensaje: "Error al obtener los perfiles." });
    }
  };