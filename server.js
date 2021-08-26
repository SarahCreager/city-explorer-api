'use strict';

//Imports
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const PORT = process.env.PORT || 3001;
require('dotenv').config();
app.use(cors());
const weatherKey = process.env.WEATHER_API_KEY;
const movieKey = process.env.MOVIE_API_KEY;
app.get('/weather', getWeather);


async function getWeather(request, response) {
  let exploreQuery = request.query.searchQuery;
  let lat = request.query.lat;
  let lon = request.query.lon;
  //get weather from WeatherBit API
  const WEATHER_API_URL = `https://api.weatherbit.io/v2.0/forecast/daily/?lat=${lat}&lon=-${lon}&key=${weatherKey}&days=5&lan=en&units=I`;
  const APIresponse = await axios.get(WEATHER_API_URL);
  if (APIresponse.data) {
    const weatherArray = APIresponse.data.data.map(day => new Forecast(day));
    response.status(200).send(weatherArray);
  } else if (APIresponse.data === undefined){
    response.status(400).send('no city found');
  } else {
    response.status(500).send('internal server error');
  }
};

class Forecast{
  constructor(day) {
    this.date = day.valid_date;
    this.description = `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

app.get('/movie', getMovie);

async function getMovie(request, response) {
  let cityName = request.query.searchQuery;
  const MOVIE_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${cityName}`;
  const APIresponse = await axios.get(MOVIE_API_URL);
  if (APIresponse.data) {
    const movieArray = APIresponse.data.results.map(film => new Movie(film));
    response.status(200).send(movieArray);
  } else if (APIresponse.data === undefined) {
    response.status(400).send('no city found');
  } else {
    response.status(500).send('internal server error');
  }
};

class Movie{
  constructor(film) {
    this.title = film.title;
    this.overview = film.overview;
    this.averageVotes = film.average_votes;
    this.totalVotes = film.total_votes;
    this.popularity = film.popularity;
    this.releaseOn = film.released_on;
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/', (request, response) => {
  response.send('hello world');
});

app.get('*', (request, response) => {
  response.status(404).send('not found');
});
