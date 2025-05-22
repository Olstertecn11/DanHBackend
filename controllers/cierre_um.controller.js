const CierreUM = require('../models/CierreUmModel');
const Log = require('../models/LogsModel');

// Crear nuevo cierre
const crearCierre = async (req, res) => {
  try {
    const data = req.body;
    data.creado_por = req.usuario?.id || 'sistema';
    data.actualizado_por = req.usuario?.id || 'sistema';

    const nuevoCierre = new CierreUM(data);
    await nuevoCierre.save();

    await Log.create({
      id_usuario: req.usuario?.id || null,
      accion: 'Crear cierre',
      detalles: `Se creó un nuevo cierre para el cliente ${data.cliente}`
    });

    res.status(201).json({ mensaje: 'Cierre creado correctamente', cierre: nuevoCierre });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cierre', error: error.message });
  }
};

// Obtener todos los cierres
const obtenerCierres = async (req, res) => {
  try {
    const cierres = await CierreUM.find();
    res.json(cierres);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cierres', error: error.message });
  }
};

// Actualizar un cierre
const actualizarCierre = async (req, res) => {
  try {
    const { id } = req.params;
    const cierre = await CierreUM.findById(id);

    if (!cierre) {
      return res.status(404).json({ mensaje: 'Cierre no encontrado' });
    }

    Object.assign(cierre, req.body);
    cierre.actualizado_por = req.usuario?.id || 'sistema';
    cierre.fecha_actualizado = new Date();
    await cierre.save();

    await Log.create({
      id_usuario: req.usuario?.id || null,
      accion: 'Actualizar cierre',
      detalles: `Se actualizó el cierre con ID ${id}`
    });

    res.json({ mensaje: 'Cierre actualizado correctamente', cierre });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cierre', error: error.message });
  }
};

// Eliminar un cierre
const eliminarCierre = async (req, res) => {
  try {
    const { id } = req.params;
    const cierre = await CierreUM.findByIdAndDelete(id);

    if (!cierre) {
      return res.status(404).json({ mensaje: 'Cierre no encontrado' });
    }

    await Log.create({
      id_usuario: req.usuario?.id || null,
      accion: 'Eliminar cierre',
      detalles: `Se eliminó el cierre con ID ${id}`
    });

    res.json({ mensaje: 'Cierre eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cierre', error: error.message });
  }
};

module.exports = {
  crearCierre,
  obtenerCierres,
  actualizarCierre,
  eliminarCierre
};
