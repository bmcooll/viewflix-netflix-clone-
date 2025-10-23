import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import ContentRow from './ContentRow';
import { tmdbService, formatContent } from '../services/tmdbApi';
import './TVShowsPage.css';

function TVShowsPage() {
  const [popularShows, setPopularShows] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);
  const [onTheAirShows, setOnTheAirShows] = useState([]);
  const [airingTodayShows, setAiringTodayShows] = useState([]);
  const [genreShows, setGenreShows] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVShowsData = async () => {
      try {
        setLoading(true);
        
        // Fetch different categories of TV shows
        const [
          popularResponse,
          topRatedResponse,
          onTheAirResponse,
          airingTodayResponse,
          genresResponse
        ] = await Promise.all([
          tmdbService.getPopularTVShows(),
          tmdbService.getTopRatedTVShows(),
          tmdbService.getOnTheAirTVShows(),
          tmdbService.getAiringTodayTVShows(),
          tmdbService.getTVGenres()
        ]);

        setPopularShows(popularResponse.data.results.map(formatContent));
        setTopRatedShows(topRatedResponse.data.results.map(formatContent));
        setOnTheAirShows(onTheAirResponse.data.results.map(formatContent));
        setAiringTodayShows(airingTodayResponse.data.results.map(formatContent));

        // Fetch shows by popular genres
        const genres = genresResponse.data.genres.slice(0, 5); // Get first 5 genres
        const genreShowsData = {};
        
        for (const genre of genres) {
          const genreResponse = await tmdbService.getTVShowsByGenre(genre.id);
          genreShowsData[genre.name] = genreResponse.data.results.map(formatContent);
        }
        
        setGenreShows(genreShowsData);
      } catch (error) {
        console.error('Error fetching TV shows data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShowsData();
  }, []);

  if (loading) {
    return (
      <div className="tv-shows-page">
        <Navigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading TV Shows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tv-shows-page">
      <Navigation />
      
      <div className="tv-shows-hero">
        <div className="hero-content">
          <h1>TV Shows</h1>
          <p>Discover amazing TV series from around the world</p>
        </div>
      </div>
      
      <div className="content-sections">
        <ContentRow 
          title="Popular TV Shows" 
          items={popularShows}
          isLarge={true}
        />
        <ContentRow 
          title="Top Rated TV Shows" 
          items={topRatedShows}
        />
        <ContentRow 
          title="On The Air" 
          items={onTheAirShows}
        />
        <ContentRow 
          title="Airing Today" 
          items={airingTodayShows}
        />
        
        {Object.entries(genreShows).map(([genreName, shows]) => (
          <ContentRow 
            key={genreName}
            title={genreName}
            items={shows}
          />
        ))}
      </div>
    </div>
  );
}

export default TVShowsPage;