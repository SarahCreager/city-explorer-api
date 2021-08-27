//Imports
const axios = require('axios');
const weatherKey = process.env.WEATHER_API_KEY;


//Function
async function getWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;

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

