const jwt = require('jsonwebtoken');

//MODIFICO AQUI AÑADIENDO EL ROL
const generateKey = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.SECRET_KEY, { expiresIn: '30d' });
};

const verifyKey = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

module.exports = { generateKey, verifyKey };
