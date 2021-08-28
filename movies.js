//Imports
const axios = require('axios');
const movieKey = process.env.MOVIE_API_KEY;
const inMemoryDB = require('./cache');

//Function
async function getMovie(request, response) {
  let cityName = request.query.searchQuery;
  if (inMemoryDB[cityName]) 
  // && (Date.now() - inMemoryDB[cityName].timestamp < 50000)) 
  {
    // if ((Date.now() - inMemoryDB[cityName].timestamp < 50000)) {
    console.log('cache hit', cityName);
    response.send(inMemoryDB[cityName]);
    return;
    // }
    // else {
    //   console.log('cache miss', cityName);
    //   inMemoryDB[cityName] = [];
    //   inMemoryDB[cityName].timestamp = Date.now();
    // }
  } else {
    console.log('cache miss', cityName);
    inMemoryDB[cityName] = [];
    inMemoryDB[cityName].timestamp = Date.now();
  }


  const MOVIE_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&query=${cityName}`;
  const APIresponse = await axios.get(MOVIE_API_URL);

  if (APIresponse.data) {
    const movieArray = APIresponse.data.results.map(film => new Movie(film));
    inMemoryDB[cityName] = movieArray;
    response.status(200).send(movieArray);
  } else if (APIresponse.data === undefined) {
    response.status(400).send('no city found');
  } else {
    response.status(500).send('internal server error');
  }
}

//Class
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

//Export
module.exports = getMovie;
