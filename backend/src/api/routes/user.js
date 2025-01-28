const { isAuth } = require('../../middlewares/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  register,
  login
} = require('../controllers/user');

const usersRouter = require('express').Router();

usersRouter.get('/', isAuth, getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/register', register);
usersRouter.put('/:id', isAuth, updateUser);
usersRouter.post('/login', login);

module.exports = usersRouter;
