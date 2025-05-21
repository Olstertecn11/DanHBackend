const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  Nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  id_rol: { type: Number, required: true },
  twoFactorEnable: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: '' },
  fecha_creacion: { type: Date, required: true },
  estado: { type: Number, required: true },
  creado_por: { type: String, required: true },
  actualizado_por: { type: String, required: true },
  fecha_actualizado: { type: String, required: true },
});

userSchema.pre("save", async function(next) {
  if (!this.isModified('contrasena')) return next(); // solo si fue modificada
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  next();
});

const User = mongoose.model("usuarios", userSchema);

module.exports = User;
