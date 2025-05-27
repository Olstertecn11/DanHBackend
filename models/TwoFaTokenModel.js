const mongoose = require("mongoose");

const twoFATokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuarios",
    required: true
  },
  token: {
    type: String,
    required: true,
    match: /^[0-9A-Fa-f]{4}$/ // asegura que sean 4 caracteres hexadecimales
  },
  creado_en: {
    type: Date,
    default: Date.now,
    expires: 200 // ⚠️ expira automáticamente en 5 minutos (300 segundos)
  }
});

module.exports = mongoose.model("2fa_tokens", twoFATokenSchema);
