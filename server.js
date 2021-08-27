'use strict';

//Imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getMovie = require('./movies');
const getWeather = require('./weather');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;


//Routes
app.get('/weather', getWeather);
app.get('/movie', getMovie);
app.get('/', (request, response) => {
  response.send('hello world');
});
app.get('*', (request, response) => {
  response.status(404).send('not found');
});


//Listener
app.listen(PORT, () => console.log(`listening on ${PORT}`));

