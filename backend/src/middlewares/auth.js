const User = require('../api/models/user');
const { verifyKey } = require('../utils/jwt');

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    //Importante esto para que se pase el token puro
    const parsedToken = token.replace('Bearer ', '');
    const { id } = verifyKey(parsedToken);
    const user = await User.findById(id);
    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json('No estás autorizado para eso');
  }
};

module.exports = { isAuth };
