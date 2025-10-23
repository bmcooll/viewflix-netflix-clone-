import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Info } from 'lucide-react';
import { tmdbService, getBackdropUrl, formatContent } from '../services/tmdbApi';
import { showToast } from './Toast';
import EpisodeSelector from './EpisodeSelector';
import './HeroBanner.css';

function HeroBanner() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [heroContent, setHeroContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);

  const handlePlayClick = () => {
    const currentContent = heroContent[currentIndex];
    if (currentContent) {
      if (currentContent.mediaType === 'tv') {
        setShowEpisodeSelector(true);
      } else {
        navigate(`/watch/${currentContent.id}`);
      }
    }
  };

  const handleEpisodeSelect = (episodeData) => {
    navigate(`/watch/${heroContent[currentIndex].id}`, { 
      state: { 
        episodeData,
        contentType: 'tv'
      } 
    });
    setShowEpisodeSelector(false);
  };

  const handleMoreInfoClick = () => {
    if (heroContent[currentIndex]) {
      navigate(`/title/${heroContent[currentIndex].id}`);
    }
  };

  const addToMyList = () => {
    const currentContent = heroContent[currentIndex];
    if (!currentContent) return;
    
    const existingList = JSON.parse(localStorage.getItem('viewflix-mylist') || '[]');
    const isAlreadyInList = existingList.some(listItem => listItem.id === currentContent.id);
    
    if (!isAlreadyInList) {
      const listItem = {
        id: currentContent.id,
        title: currentContent.title,
        image: currentContent.image,
        year: currentContent.year,
        rating: currentContent.rating,
        description: currentContent.description,
        mediaType: currentContent.mediaType
      };
      
      const updatedList = [...existingList, listItem];
      localStorage.setItem('viewflix-mylist', JSON.stringify(updatedList));
      showToast(`Added "${currentContent.title}" to My List`, 'success');
    } else {
      showToast(`"${currentContent.title}" is already in My List`, 'info');
    }
  };

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await tmdbService.getTrending('all', 'week');
        const formattedContent = response.data.results.slice(0, 3).map(item => {
          const formatted = formatContent(item);
          return {
            ...formatted,
            backgroundImage: getBackdropUrl(item.backdrop_path, 'w1280'),
            logo: formatted.title.toUpperCase(),
            rating: item.adult ? 'R' : 'PG-13',
            seasons: formatted.mediaType === 'tv' ? '1 Season' : `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
            genre: formatted.mediaType === 'tv' ? 'TV Series' : 'Movie'
          };
        });
        setHeroContent(formattedContent);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hero content:', error);
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  useEffect(() => {
    if (heroContent.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroContent.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [heroContent]);

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (loading || heroContent.length === 0) {
    return (
      <div className="hero-banner">
        <div className="hero-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const currentContent = heroContent[currentIndex];

  return (
    <div className="hero-banner">
      <div 
        className={`hero-background ${isLoaded ? 'loaded' : ''}`}
        style={{ backgroundImage: `url(${currentContent.backgroundImage})` }}
      >
        <div className="hero-overlay" />
      </div>
      
      <div className="hero-content">
        <div className="hero-info">
          <div className="hero-logo">
            <h1>{currentContent.logo}</h1>
          </div>
          
          <div className="hero-meta">
            <span className="hero-year">{currentContent.year}</span>
            <span className="hero-rating">{currentContent.rating}</span>
            <span className="hero-seasons">{currentContent.seasons}</span>
            <span className="hero-genre">{currentContent.genre}</span>
          </div>
          
          <p className="hero-description">
            {currentContent.description}
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn btn-white hero-play-btn"
              onClick={handlePlayClick}
            >
              <Play size={20} fill="currentColor" />
              Play
            </button>
            <button 
              className="btn btn-secondary hero-info-btn"
              onClick={handleMoreInfoClick}
            >
              <Info size={20} />
              More Info
            </button>
            <button 
              className="btn btn-secondary hero-list-btn"
              onClick={addToMyList}
            >
              <Plus size={20} />
              My List
            </button>
          </div>
        </div>
      </div>
      
      <div className="hero-indicators">
        {heroContent.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
      
      {showEpisodeSelector && heroContent[currentIndex] && (
        <EpisodeSelector
          showId={heroContent[currentIndex].id}
          contentTitle={heroContent[currentIndex].title}
          onClose={() => setShowEpisodeSelector(false)}
          onEpisodeSelect={handleEpisodeSelect}
        />
      )}
    </div>
  );
}

export default HeroBanner;