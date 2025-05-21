const User = require('../models/UserModel');

// Crear un nuevo usuario
const crearUsuario = async (req, res) => {
  console.log('creating')
  try {
    const {
      Nombre,
      correo,
      contrasena,
      id_rol,
      creado_por,
      actualizado_por,
      estado
    } = req.body;

    const existe = await User.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const nuevoUsuario = new User({
      Nombre,
      correo,
      contrasena,
      id_rol,
      creado_por,
      actualizado_por,
      estado,
      fecha_creacion: new Date(),
      fecha_actualizado: new Date().toISOString(),
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};


const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('Nombre correo id_rol fecha_creacion estado');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};


// Actualizar un usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const campos = [
      'Nombre', 'correo', 'contrasena', 'id_rol',
      'estado', 'actualizado_por'
    ];

    campos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        usuario[campo] = req.body[campo];
      }
    });

    usuario.fecha_actualizado = new Date().toISOString();

    await usuario.save();

    res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar un usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario
};
