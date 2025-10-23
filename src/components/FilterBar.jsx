import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { tmdbService } from '../services/tmdbApi';
import './FilterBar.css';

function FilterBar({ onFiltersChange, contentType = 'movie' }) {
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = contentType === 'movie' 
          ? await tmdbService.getMovieGenres()
          : await tmdbService.getTVGenres();
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [contentType]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      genre: '',
      year: '',
      rating: '',
      sortBy: 'popularity.desc'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'popularity.desc'
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="filter-bar">
      <button 
        className={`filter-toggle ${showFilters ? 'active' : ''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={20} />
        Filters
        {hasActiveFilters && <span className="filter-indicator" />}
      </button>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-header">
            <h3>Filter & Sort</h3>
            <button 
              className="close-filters"
              onClick={() => setShowFilters(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="filter-content">
            <div className="filter-group">
              <label>Genre</label>
              <select 
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Release Year</label>
              <select 
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">Any Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Rating</label>
              <select 
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="9">9+ Stars</option>
                <option value="8">8+ Stars</option>
                <option value="7">7+ Stars</option>
                <option value="6">6+ Stars</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="popularity.asc">Least Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="vote_average.asc">Lowest Rated</option>
                <option value="release_date.desc">Newest First</option>
                <option value="release_date.asc">Oldest First</option>
                <option value="title.asc">A-Z</option>
                <option value="title.desc">Z-A</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;