require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const cors = require('cors');
const usersRouter = require('./src/api/routes/user');
const eventosRouter = require('./src/api/routes/evento');
const cloudinary = require('cloudinary').v2;

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

connectDB();

app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.use(express.json());
app.use('/api/v1/eventos', eventosRouter);
app.use('/api/v1/users', usersRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json('Route Not Found');
});

app.listen(3000, () => {
  console.log('Conectado con éxito al servidor http://localhost:3000');
});
