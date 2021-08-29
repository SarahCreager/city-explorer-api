//Imports
const axios = require('axios');
const weatherKey = process.env.WEATHER_API_KEY;
const inMemoryDB = require('./cache.js');

//Functions
async function getWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let cityName = `weather-${lat}${lon}`;

  if (inMemoryDB[cityName]) {
    if ((Date.now() - inMemoryDB[cityName].timestamp) < 1000 * 60 * 10) {
      console.log('cache hit', cityName);
      response.send(inMemoryDB[cityName].data);
    } else {
      cacheMiss(request, response, cityName);
    }
  } else {
    cacheMiss(request, response, cityName);
  }
}

async function cacheMiss (request, response, cityName){
  console.log('cache miss', cityName);
  inMemoryDB[cityName] = {};
  inMemoryDB[cityName].timestamp = Date.now();

  const WEATHER_API_URL = `https://api.weatherbit.io/v2.0/forecast/daily/?lat=${request.query.lat}&lon=-${request.query.lon}&key=${weatherKey}&days=5&lan=en&units=I`;
  const APIresponse = await axios.get(WEATHER_API_URL);

  const weatherArray = APIresponse.data.data.map(day => new Forecast(day));
  inMemoryDB[cityName].data = weatherArray;
  response.status(200).send(weatherArray);
}

//Class
class Forecast{
  constructor(day) {
    this.date = day.valid_date;
    this.description = `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`;
  }
}

//Export
module.exports = getWeather;



