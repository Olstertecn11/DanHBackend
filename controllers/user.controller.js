const User = require('../models/UserModel');
const Log = require('../models/LogsModel');

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const { Nombre, correo, contrasena, id_rol, estado } = req.body;
    const usuarioActual = req.usuario?.id || 0;

    const existe = await User.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const nuevoUsuario = new User({
      Nombre,
      correo,
      contrasena,
      id_rol,
      estado,
      creado_por: usuarioActual,
      actualizado_por: usuarioActual,
      fecha_creacion: new Date(),
      fecha_actualizado: new Date().toISOString(),
    });

    await nuevoUsuario.save();

    await Log.create({
      id_usuario: usuarioActual,
      accion: 'Crear usuario',
      detalles: `Se creó el usuario ${Nombre} con correo ${correo}`
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};

// Obtener usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('Nombre correo id_rol fecha_creacion estado');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const campos = ['Nombre', 'correo', 'contrasena', 'id_rol', 'estado'];
    campos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        usuario[campo] = req.body[campo];
      }
    });

    usuario.actualizado_por = req.usuario?.id || 0;
    usuario.fecha_actualizado = new Date().toISOString();
    await usuario.save();

    await Log.create({
      id_usuario: req.usuario?.id || 0,
      accion: 'Actualizar usuario',
      detalles: `Se actualizó el usuario ${usuario.Nombre} (${usuario.correo})`
    });

    res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    await Log.create({
      id_usuario: req.usuario?.id || 0,
      accion: 'Eliminar usuario',
      detalles: `Se eliminó el usuario ${usuario.Nombre} (${usuario.correo})`
    });

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

// Obtener solo el rol de un usuario
const getUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.findById(id).select('id_rol');

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ id_rol: usuario.id_rol });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener rol de usuario', error: error.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  getUserRole
};
