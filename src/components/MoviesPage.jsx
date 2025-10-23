import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import ContentRow from './ContentRow';
import { tmdbService, formatContent } from '../services/tmdbApi';
import './MoviesPage.css';

function MoviesPage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        setLoading(true);
        
        // Fetch different categories of movies
        const [
          popularResponse,
          topRatedResponse,
          nowPlayingResponse,
          upcomingResponse,
          genresResponse
        ] = await Promise.all([
          tmdbService.getPopularMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getNowPlayingMovies(),
          tmdbService.getUpcomingMovies(),
          tmdbService.getMovieGenres()
        ]);

        setPopularMovies(popularResponse.data.results.map(formatContent));
        setTopRatedMovies(topRatedResponse.data.results.map(formatContent));
        setNowPlayingMovies(nowPlayingResponse.data.results.map(formatContent));
        setUpcomingMovies(upcomingResponse.data.results.map(formatContent));

        // Fetch movies by popular genres
        const genres = genresResponse.data.genres.slice(0, 5); // Get first 5 genres
        const genreMoviesData = {};
        
        for (const genre of genres) {
          const genreResponse = await tmdbService.getMoviesByGenre(genre.id);
          genreMoviesData[genre.name] = genreResponse.data.results.map(formatContent);
        }
        
        setGenreMovies(genreMoviesData);
      } catch (error) {
        console.error('Error fetching movies data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, []);

  if (loading) {
    return (
      <div className="movies-page">
        <Navigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <Navigation />
      
      <div className="movies-hero">
        <div className="hero-content">
          <h1>Movies</h1>
          <p>Explore the latest blockbusters and timeless classics</p>
        </div>
      </div>
      
      <div className="content-sections">
        <ContentRow 
          title="Popular Movies" 
          items={popularMovies}
          isLarge={true}
        />
        <ContentRow 
          title="Top Rated Movies" 
          items={topRatedMovies}
        />
        <ContentRow 
          title="Now Playing" 
          items={nowPlayingMovies}
        />
        <ContentRow 
          title="Upcoming Movies" 
          items={upcomingMovies}
        />
        
        {Object.entries(genreMovies).map(([genreName, movies]) => (
          <ContentRow 
            key={genreName}
            title={genreName}
            items={movies}
          />
        ))}
      </div>
    </div>
  );
}

export default MoviesPage;