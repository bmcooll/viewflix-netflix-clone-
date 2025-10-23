import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroBanner from './HeroBanner';
import ContentRow from './ContentRow';
import ContinueWatching from './ContinueWatching';
import { tmdbService, formatContent } from '../services/tmdbApi';
import { addSampleContinueWatchingData, addSampleMyListData } from '../utils/sampleData';
import './HomePage.css';

function HomePage() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data
    addSampleContinueWatchingData();
    addSampleMyListData();
    
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch different categories of content
        const [
          trendingResponse,
          popularMoviesResponse,
          popularTVResponse,
          topRatedResponse,
          upcomingResponse,
          actionResponse,
          comedyResponse
        ] = await Promise.all([
          tmdbService.getTrending('all', 'week'),
          tmdbService.getPopularMovies(),
          tmdbService.getPopularTVShows(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getUpcomingMovies(),
          tmdbService.getMoviesByGenre(28), // Action genre ID
          tmdbService.getMoviesByGenre(35)  // Comedy genre ID
        ]);

        setTrending(trendingResponse.data.results.map(formatContent));
        setPopularMovies(popularMoviesResponse.data.results.map(formatContent));
        setPopularTVShows(popularTVResponse.data.results.map(formatContent));
        setTopRatedMovies(topRatedResponse.data.results.map(formatContent));
        setUpcomingMovies(upcomingResponse.data.results.map(formatContent));
        setActionMovies(actionResponse.data.results.map(formatContent));
        setComedyMovies(comedyResponse.data.results.map(formatContent));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="homepage">
        <Navigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading ViewFlix...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="homepage">
      <Navigation />
      <HeroBanner />
      
      <div className="content-sections">
        <ContentRow 
          title="Trending Now" 
          items={trending}
          isLarge={true}
        />
        <ContinueWatching />
        <ContentRow 
          title="Popular Movies" 
          items={popularMovies}
        />
        <ContentRow 
          title="Popular TV Shows" 
          items={popularTVShows}
        />
        <ContentRow 
          title="Top Rated Movies" 
          items={topRatedMovies}
        />
        <ContentRow 
          title="New Releases" 
          items={upcomingMovies}
        />
        <ContentRow 
          title="Action Movies" 
          items={actionMovies}
        />
        <ContentRow 
          title="Comedy Movies" 
          items={comedyMovies}
        />
        <ContentRow 
          title="Because you watched trending content" 
          items={trending.slice(0, 6)}
        />
      </div>
      
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">Questions? Contact us.</a>
            <div className="footer-grid">
              <a href="#">FAQ</a>
              <a href="#">Help Center</a>
              <a href="#">Account</a>
              <a href="#">Media Center</a>
              <a href="#">Investor Relations</a>
              <a href="#">Jobs</a>
              <a href="#">Ways to Watch</a>
              <a href="#">Terms of Use</a>
              <a href="#">Privacy</a>
              <a href="#">Cookie Preferences</a>
              <a href="#">Corporate Information</a>
              <a href="#">Contact Us</a>
              <a href="#">Speed Test</a>
              <a href="#">Legal Notices</a>
              <a href="#">Only on ViewFlix</a>
            </div>
          </div>
          <div className="service-code">
            <button>Service Code</button>
          </div>
          <div className="copyright">
            © 1997-2024 ViewFlix, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;