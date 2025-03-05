import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "90696079";
const API_URL = "https://www.omdbapi.com/";

const App = () => {
  const [searchMovie, setSearchMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const fetchMovies = async () => {
    if (!searchMovie) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?s=${searchMovie}&apikey=${API_KEY}`);
      if (response.data.Search) {
        setMovies(response.data.Search);
        setErrorMessage("");
      } else {
        setMovies([]);
        setErrorMessage("No data found, sorry!");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch data. Please try again later.");
    }
    setLoading(false);
  };

  const fetchMovieDetails = async (imdbID) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?i=${imdbID}&apikey=${API_KEY}`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchMovies();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Movie Search App</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchMovie}
          onKeyPress={handleKeyPress}
          onChange={(e) => setSearchMovie(e.target.value)}
          placeholder="Search for a movie..."
          className="search-bar"
        />
        <button onClick={fetchMovies} className="search-button">Search</button>
      </div>
      
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="movie-card"
            onClick={() => fetchMovieDetails(movie.imdbID)}
          >
            <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
            <h2 className="movie-title">{movie.Title} ({movie.Year})</h2>
          </div>
        ))}
      </div>

      {selectedMovie && !loading && (
        <div className="movie-details">
          <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
          <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
          <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
          <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
        </div>
      )}
    </div>
  );
};

export default App;