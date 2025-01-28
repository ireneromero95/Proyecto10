const Evento = require('../models/evento');

const getEventos = async (req, res, next) => {
  try {
    //Falta el populate
    const eventos = await Evento.find();
    return res.status(200).json(eventos);
  } catch (error) {
    return res.status(400).json('error');
  }
};

const postEvento = async (req, res, next) => {
  try {
    console.log(req.body);
    const newEvento = new Evento(req.body);
    if (req.file) {
      newEvento.cartel = req.file.path;
    }
    const eventoSaved = await newEvento.save();
    return res.status(201).json({
      message: 'Evento creado correctamente',
      evento: eventoSaved
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json('No se creó el evento');
  }
};

const getEventoById = async (req, res, next) => {
  try {
    //Falta el populate?
    const { id } = req.params;
    const evento = await Evento.findById(id);
    return res.status(200).json(evento);
  } catch (error) {
    return res.status(400).json('error');
  }
};
const updateEvento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newEvento = new Evento(req.body);
    newEvento._id = id;
    const eventoUpdated = await Evento.findByIdAndUpdate(id, newEvento, {
      new: true
    });
    return res.status(201).json({
      message: 'Evento actualizado correctamente',
      evento: eventoUpdated
    });
  } catch (error) {
    return res.status(400).json('error');
  }
};

const deleteEvento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByIdAndDelete(id);
    return res.status(200).json({
      mensaje: 'Ha sido eliminado con éxito',
      eventoEliminado: evento
    });
  } catch (error) {
    return res.status(400).json('Error eliminando');
  }
};

module.exports = {
  getEventos,
  getEventoById,
  postEvento,
  updateEvento,
  deleteEvento
};
