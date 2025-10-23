import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Play, Plus, ThumbsUp, Info } from 'lucide-react';
import Navigation from './Navigation';
import { tmdbService, formatContent } from '../services/tmdbApi';
import './SearchPage.css';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popularContent, setPopularContent] = useState([]);

  useEffect(() => {
    const fetchPopularContent = async () => {
      try {
        const response = await tmdbService.getTrending('all', 'week');
        setPopularContent(response.data.results.slice(0, 6).map(formatContent));
      } catch (error) {
        console.error('Error fetching popular content:', error);
      }
    };

    fetchPopularContent();
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await tmdbService.searchMulti(searchQuery);
      const formattedResults = response.data.results
        .filter(item => item.media_type !== 'person') // Filter out people
        .map(item => {
          const formatted = formatContent(item);
          return {
            ...formatted,
            duration: formatted.mediaType === 'tv' ? 'TV Series' : 'Movie',
            genres: [] // We'll need to fetch genres separately if needed
          };
        });
      setResults(formattedResults);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <Navigation />
      
      <div className="search-content">
        <div className="search-header">
          <div className="search-input-container">
            <Search size={24} className="search-input-icon" />
            <input
              type="text"
              placeholder="Search for movies, TV shows, documentaries and more"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch(query)}
              className="search-main-input"
              autoFocus
            />
          </div>
        </div>

        <div className="search-results">
          {isLoading ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : query && results.length > 0 ? (
            <>
              <h2 className="results-title">
                Search results for "{query}" ({results.length} {results.length === 1 ? 'result' : 'results'})
              </h2>
              <div className="results-grid">
                {results.map((item) => (
                  <div key={item.id} className="result-item">
                    <Link to={`/title/${item.id}`} className="result-link">
                      <div className="result-image">
                        <img src={item.image} alt={item.title} />
                        <div className="result-overlay">
                          <button className="result-play-btn">
                            <Play size={20} fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </Link>
                    <div className="result-info">
                      <div className="result-header">
                        <h3 className="result-title">{item.title}</h3>
                        <div className="result-actions">
                          <button className="action-btn">
                            <Plus size={16} />
                          </button>
                          <button className="action-btn">
                            <ThumbsUp size={16} />
                          </button>
                          <Link to={`/title/${item.id}`} className="action-btn">
                            <Info size={16} />
                          </Link>
                        </div>
                      </div>
                      <div className="result-meta">
                        <span className="result-match">{item.match}% Match</span>
                        <span className="result-year">{item.year}</span>
                        <span className="result-rating">{item.rating}</span>
                        <span className="result-duration">{item.duration}</span>
                      </div>
                      <p className="result-description">{item.description}</p>
                      <div className="result-genres">
                        {item.genres.map((genre, index) => (
                          <span key={index} className="genre-tag">{genre}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : query && results.length === 0 && !isLoading ? (
            <div className="no-results">
              <h2>No results found for "{query}"</h2>
              <p>Try different keywords or browse our categories</p>
              <div className="search-suggestions">
                <h3>Popular searches:</h3>
                <div className="suggestion-tags">
                  <button onClick={() => performSearch('action')}>Action</button>
                  <button onClick={() => performSearch('comedy')}>Comedy</button>
                  <button onClick={() => performSearch('drama')}>Drama</button>
                  <button onClick={() => performSearch('sci-fi')}>Sci-Fi</button>
                  <button onClick={() => performSearch('thriller')}>Thriller</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="search-empty">
              <h2>Discover something new</h2>
              <p>Search for your favorite movies, TV shows, documentaries and more</p>
              <div className="popular-searches">
                <h3>Popular on ViewFlix:</h3>
                <div className="popular-grid">
                  {popularContent.map((item) => (
                    <Link key={item.id} to={`/title/${item.id}`} className="popular-item">
                      <img src={item.image} alt={item.title} />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;