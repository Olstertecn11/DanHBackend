// controllers/RegistroController.js
const Registro = require('../model/logsmodel');

// Crear un nuevo registro
exports.crearRegistro = async (req, res) => {
  try {
    const { id_usuario, fecha, accion,detalles } = req.body;

    const nuevoRegistro = new Registro({
      id_usuario,
      fecha,
      accion,
      detalles
    });

    // Guardar el nuevo registro en la base de datos
    await nuevoRegistro.save();
    res.status(201).json({ mensaje: "Registro creado exitosamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al crear el registro." });
  }
};

// Obtener todos los registros
exports.obtenerRegistros = async (req, res) => {
  try {
    const registros = await Registro.find().populate('id_usuario', 'correo');
    res.status(200).json(registros);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al obtener los registros." });
  }
};

// Obtener registros de un usuario específico
exports.obtenerRegistrosPorUsuario = async (req, res) => {
  try {
    const registros = await Registro.find({ usuarioId: req.params.usuarioId }).populate('id_usuario', 'correo');
    if (registros.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron registros para este usuario." });
    }
    res.status(200).json(registros);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error al obtener los registros del usuario." });
  }
};
