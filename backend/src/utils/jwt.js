const jwt = require('jsonwebtoken');

const generateKey = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '30d' });
};

const verifyKey = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY);
};

module.exports = { generateKey, verifyKey };
