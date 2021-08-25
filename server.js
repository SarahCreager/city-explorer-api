const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3001;
require('dotenv').config();
const weatherData = require('./data/weather.json');
app.use(cors());

app.get('/weather', (request, response) => {
  let exploreQuery = request.query.searchQuery;
  const city = weatherData.find(city => city.city_name.toLowerCase() === exploreQuery.toLowerCase());

  if (city) {
    const weatherArray = city.data.map(day => new Forecast(day));
    response.status(200).send(weatherArray);
  } else if (city.city_name !== exploreQuery){
    response.status(400).send('no city found');
  } else {
    response.status(500).send('internal server error');
  }
});

function Forecast(day){
  this.date = day.valid_date;
  this.description = `Low of ${day.low_temp}, high of ${day.max_temp} with ${day.weather.description}`;
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('*', (request, response) => {
  response.status(404).send('not found');
});
