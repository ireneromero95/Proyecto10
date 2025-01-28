const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    ciudad: { type: String, required: true },
    precio: { type: Number, required: true },
    cartel: { type: String, required: true },
    asistentes: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: 'users'
      }
    ]
  },
  { timestamps: true, collection: 'eventos' }
);

const Evento = mongoose.model('eventos', eventoSchema, 'eventos');

module.exports = Evento;
