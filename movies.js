//Imports
const axios = require('axios');
const movieKey = process.env.MOVIE_API_KEY;

//Function
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
