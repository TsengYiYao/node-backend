const idpwd = require('./idpwd');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users-route');
const placesRoutes = require('./routes/places-route');
const HttpError = require('./models/http-error');

const app = express();
const url = `mongodb+srv://${idpwd.idpwd}@cluster0-411ex.mongodb.net/places?retryWrites=true&w=majority`;

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unkown error occurred!' });
});

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });

