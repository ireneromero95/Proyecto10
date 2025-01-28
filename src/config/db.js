const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Conectado correctamente a la BDD');
  } catch (error) {
    console.log('No se ha conectado a la BDD');
  }
};

module.exports = { connectDB };
