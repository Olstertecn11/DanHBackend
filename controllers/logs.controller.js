const Log = require('../models/LogsModel');

// Crear un nuevo log
const crearLog = async (req, res) => {
  try {
    const { id_usuario, accion, detalles } = req.body;

    if (!id_usuario || !accion || !detalles) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const nuevoLog = new Log({
      id_usuario,
      accion,
      detalles,
      fecha: new Date()
    });

    await nuevoLog.save();

    res.status(201).json({ mensaje: 'Log registrado correctamente', log: nuevoLog });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar log', error: error.message });
  }
};

// Obtener todos los logs
const obtenerLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ fecha: -1 }); // más recientes primero
    res.json(logs);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener logs', error: error.message });
  }
};

module.exports = {
  crearLog,
  obtenerLogs
};
