const mongoose = require('mongoose');

const RegistroSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },
  accion: { type: String, required: true },
  detalles: { type: String, required: true }
});

module.exports = mongoose.model('logs', RegistroSchema);
