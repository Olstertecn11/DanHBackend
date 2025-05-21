const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  id_usuario: { type: Number, required: true }, 
  fecha: { type: Date, default: Date.now },
  accion:{type:String, required: true},
  detalles: { type: String, required: true } 
});

module.exports = mongoose.model('logs', registroSchema);
