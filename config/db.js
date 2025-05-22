const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://dhernandezs13:12345678d@clustercolmov.d5cjn.mongodb.net/col_mov_user?retryWrites=true&w=majority&appName=clustercolmov', {
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
