//Imports
const axios = require('axios');
const movieKey = process.env.MOVIE_API_KEY;
const inMemoryDB = require('./cache.js');


//Functions
function getMovie(request, response) {
  let cityName = `movie-${request.query.searchQuery}`;
  if (inMemoryDB[cityName]) {
    if ((Date.now() - inMemoryDB[cityName].timestamp) < 1000 * 60 * 60 * 24 * 7) {
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
  // reset inMemoryDB[cityName] if info has timed out and give it a timestamp.
  inMemoryDB[cityName] = {};
  inMemoryDB[cityName].timestamp = Date.now();
  // pull movie info from API
  const MOVIE_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${request.query.searchQuery}`;
  const APIresponse = await axios.get(MOVIE_API_URL);
  // create Movie instances for all the results in the API matching our searchQuery.
  const movieArray = APIresponse.data.results.map(film => new Movie(film));
  // save the info we gathered and organized from API into cache and send it.
  inMemoryDB[cityName].data = movieArray;
  response.status(200).send(movieArray);
}

//Class
class Movie {
  constructor(film) {
    this.title = film.title;
    this.overview = film.overview;
    this.averageVotes = film.average_votes;
    this.totalVotes = film.total_votes;
    this.popularity = film.popularity;
    this.releaseOn = film.released_on;
  }
}

//Export
module.exports = getMovie;
