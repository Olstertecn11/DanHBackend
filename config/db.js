const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1); // Finaliza el proceso si hay error
  }
};

module.exports = conectarDB;
