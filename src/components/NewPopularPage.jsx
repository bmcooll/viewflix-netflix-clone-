import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import ContentRow from './ContentRow';
import { tmdbService, formatContent } from '../services/tmdbApi';
import './NewPopularPage.css';

function NewPopularPage() {
  const [trendingAll, setTrendingAll] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [onTheAirTV, setOnTheAirTV] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewPopularData = async () => {
      try {
        setLoading(true);
        
        // Fetch trending and new content
        const [
          trendingAllResponse,
          trendingMoviesResponse,
          trendingTVResponse,
          upcomingResponse,
          onTheAirResponse
        ] = await Promise.all([
          tmdbService.getTrending('all', 'week'),
          tmdbService.getTrending('movie', 'week'),
          tmdbService.getTrending('tv', 'week'),
          tmdbService.getUpcomingMovies(),
          tmdbService.getOnTheAirTVShows()
        ]);

        setTrendingAll(trendingAllResponse.data.results.map(formatContent));
        setTrendingMovies(trendingMoviesResponse.data.results.map(formatContent));
        setTrendingTV(trendingTVResponse.data.results.map(formatContent));
        setUpcomingMovies(upcomingResponse.data.results.map(formatContent));
        setOnTheAirTV(onTheAirResponse.data.results.map(formatContent));
      } catch (error) {
        console.error('Error fetching new & popular data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewPopularData();
  }, []);

  if (loading) {
    return (
      <div className="new-popular-page">
        <Navigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading New & Popular...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="new-popular-page">
      <Navigation />
      
      <div className="new-popular-hero">
        <div className="hero-content">
          <h1>New & Popular</h1>
          <p>Stay up to date with the latest releases and trending content</p>
        </div>
      </div>
      
      <div className="content-sections">
        <ContentRow 
          title="Trending Now" 
          items={trendingAll}
          isLarge={true}
        />
        <ContentRow 
          title="Trending Movies" 
          items={trendingMovies}
        />
        <ContentRow 
          title="Trending TV Shows" 
          items={trendingTV}
        />
        <ContentRow 
          title="New Movie Releases" 
          items={upcomingMovies}
        />
        <ContentRow 
          title="New TV Episodes" 
          items={onTheAirTV}
        />
      </div>
    </div>
  );
}

export default NewPopularPage;