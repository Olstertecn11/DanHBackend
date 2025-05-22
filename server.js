const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const logsRoutes = require('./routes/logs.routes');
const conectarDB = require('./config/db');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configurado correctamente para permitir cookies
app.use(cors({
  origin: 'http://localhost:3001', // 👈 Tu frontend
  credentials: true                // 👈 Habilita envío de cookies
}));

// 🧠 Middleware
app.use(cookieParser()); // Necesario para leer cookies JWT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (opcional, si usas sesiones además de JWT)
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// 🛠️ Conexión a MongoDB
conectarDB();

// 📦 Rutas
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);

// 🏠 Ruta base
app.get("/", (req, res) => {
  res.json({ message: "API funcionando..." });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Escuchando en el puerto ${PORT}`);
});
