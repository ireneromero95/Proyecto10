const { generateKey } = require('../../utils/jwt');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('asistire');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json('error');
  }
};

const register = async (req, res, next) => {
  try {
    const userDuplicated = await User.findOne({
      userName: req.body.userName
    });
    const correoDuplicated = await User.findOne({
      correo: req.body.correo
    });
    if (userDuplicated || correoDuplicated) {
      return res.status(400).json('Usuario o correo ya existente');
    }
    const newUser = new User({
      userName: req.body.userName,
      correo: req.body.correo,
      password: req.body.password,
      rol: 'user'
    });
    const userSaved = await newUser.save();
    return res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      user: userSaved
    });
  } catch (error) {
    return res.status(400).json('error registrando usuario');
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('asistire');
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json('error');
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id) {
      return res
        .status(400)
        .json('No puedes actualizar alguien que no seas tú');
    }

    const newUser = new User(req.body);
    newUser._id = id;
    const userUpdated = await User.findByIdAndUpdate(id, newUser, {
      new: true
    });
    return res.status(200).json({ mensaje: 'usuario actualizado', newUser });
  } catch (error) {
    return res.status(400).json('error');
  }
};

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json('Usuario o contraseña incorrectos');
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateKey(user._id);
      return res.status(200).json({ token, user });
    }
    return res.status(400).json('Usuario o contraseña incorrectos');
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(400).json('Error con el inicio de sesión');
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  register,
  updateUser,
  login,
  deleteUser
};
