const { isAdmin } = require('../../middlewares/admin');
const { isAuth } = require('../../middlewares/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  register,
  login,
  deleteUser
} = require('../controllers/user');

const usersRouter = require('express').Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', isAuth, isAdmin, getUserById);
usersRouter.post('/register', register);
usersRouter.put('/:id', isAuth, updateUser);
usersRouter.post('/login', login);
usersRouter.delete('/:id', isAuth, isAdmin, deleteUser);

module.exports = usersRouter;
