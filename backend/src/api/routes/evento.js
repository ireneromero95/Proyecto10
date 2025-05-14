const { isAdmin } = require('../../middlewares/admin');
const { isAuth } = require('../../middlewares/auth');
const uploadCartel = require('../../middlewares/file');
const {
  getEventos,
  getEventoById,
  updateEvento,
  postEvento,
  deleteEvento
} = require('../controllers/evento');

const eventosRouter = require('express').Router();

eventosRouter.get('/', getEventos);
eventosRouter.get('/:id', getEventoById);
eventosRouter.post('/', uploadCartel.single('cartel'), postEvento);
eventosRouter.put('/:id', isAuth, updateEvento);
eventosRouter.delete('/:id', isAuth, isAdmin, deleteEvento);

module.exports = eventosRouter;
