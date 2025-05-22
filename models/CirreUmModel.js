const mongoose = require('mongoose');

const cierreUMSchema = new mongoose.Schema({
  // Información preliminar
  id: { type: String, required: true },
  proyecto: { type: String },
  cliente: { type: String, required: true },
  direccion: { type: String },
  tipo_servicio: { type: String },
  medio: { type: String },
  ot: { type: String },
  central_ur: { type: String },
  rda: { type: String },
  supervisor_preliminar: { type: String },
  pruebas_preliminar: { type: String },

  // Información de cierre
  supervisor: { type: String },
  pruebas: { type: String },
  despacho: { type: String },
  fecha_asignacion: { type: Date },
  fecha_entrega: { type: Date },
  estado: { type: String },
  observaciones: { type: String },
  tecnico: { type: String },
  odt: { type: String },
  protocolo: { type: String },
  cnoc: { type: String },

  // Meta información
  creado_por: { type: String, default: 'sistema' },
  actualizado_por: { type: String, default: 'sistema' },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_actualizado: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CierreUM', cierreUMSchema, 'cierres_um');
