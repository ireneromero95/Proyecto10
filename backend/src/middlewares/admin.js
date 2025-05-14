const isAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res
      .status(403)
      .json({ message: 'No tienes permisos de administrador' });
  }

  next();
};

module.exports = { isAdmin };
