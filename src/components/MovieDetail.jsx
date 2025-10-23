import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ThumbsDown, Share, ArrowLeft, Star } from 'lucide-react';
import { showToast } from './Toast';
import EpisodeSelector from './EpisodeSelector';
import Navigation from './Navigation';
import ContentRow from './ContentRow';
import { tmdbService, getBackdropUrl, formatContent } from '../services/tmdbApi';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [content, setContent] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);

  const handlePlayClick = () => {
    if (content?.mediaType === 'tv') {
      setShowEpisodeSelector(true);
    } else {
      navigate(`/watch/${id}`);
    }
  };

  const handleEpisodeSelect = (episodeData) => {
    // Navigate to video player with episode information
    navigate(`/watch/${id}`, { 
      state: { 
        episodeData,
        contentType: 'tv'
      } 
    });
  };

  const addToMyList = () => {
    if (!content) return;
    
    const existingList = JSON.parse(localStorage.getItem('viewflix-mylist') || '[]');
    const isAlreadyInList = existingList.some(listItem => listItem.id === content.id);
    
    if (!isAlreadyInList) {
      const listItem = {
        id: content.id,
        title: content.title,
        image: `https://image.tmdb.org/t/p/w500${content.poster_path || ''}`,
        year: content.year,
        rating: content.match,
        description: content.description,
        mediaType: content.mediaType
      };
      
      const updatedList = [...existingList, listItem];
      localStorage.setItem('viewflix-mylist', JSON.stringify(updatedList));
      showToast(`Added "${content.title}" to My List`, 'success');
    } else {
      showToast(`"${content.title}" is already in My List`, 'info');
    }
  };

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        setLoading(true);
        
        // First try to get as movie, then as TV show
        let contentData;
        let similarData;
        
        try {
          const movieResponse = await tmdbService.getMovieDetails(id);
          contentData = movieResponse.data;
          similarData = movieResponse.data.similar?.results || [];
        } catch (movieError) {
          try {
            const tvResponse = await tmdbService.getTVShowDetails(id);
            contentData = tvResponse.data;
            similarData = tvResponse.data.similar?.results || [];
          } catch (tvError) {
            console.error('Content not found:', tvError);
            return;
          }
        }

        const isMovie = !!contentData.title;
        const formattedContent = {
          id: contentData.id,
          title: isMovie ? contentData.title : contentData.name,
          year: isMovie 
            ? new Date(contentData.release_date).getFullYear() 
            : new Date(contentData.first_air_date).getFullYear(),
          rating: contentData.adult ? 'R' : 'PG-13',
          duration: isMovie 
            ? `${Math.floor(contentData.runtime / 60)}h ${contentData.runtime % 60}m`
            : `${contentData.number_of_seasons} Season${contentData.number_of_seasons > 1 ? 's' : ''}`,
          genres: contentData.genres?.map(g => g.name) || [],
          description: contentData.overview,
          cast: contentData.credits?.cast?.slice(0, 4).map(c => c.name) || [],
          creator: isMovie 
            ? contentData.credits?.crew?.find(c => c.job === 'Director')?.name || 'Unknown'
            : contentData.created_by?.[0]?.name || 'Unknown',
          backgroundImage: getBackdropUrl(contentData.backdrop_path),
          logo: (isMovie ? contentData.title : contentData.name).toUpperCase(),
          match: Math.round(contentData.vote_average * 10),
          mediaType: isMovie ? 'movie' : 'tv',
          seasons: contentData.seasons || []
        };

        setContent(formattedContent);
        setSimilar(similarData.slice(0, 6).map(formatContent));
      } catch (error) {
        console.error('Error fetching content details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContentDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="movie-detail">
        <Navigation />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="movie-detail">
        <Navigation />
        <div className="loading">
          <p>Content not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      <Navigation />
      
      <div className="detail-hero">
        <div 
          className="detail-background"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        >
          <div className="detail-overlay" />
        </div>
        
        <div className="detail-content">
          <Link to="/" className="back-button">
            <ArrowLeft size={24} />
          </Link>
          
          <div className="detail-info">
            <div className="detail-logo">
              <h1>{content.logo}</h1>
            </div>
            
            <div className="detail-meta">
              <span className="detail-match">
                <Star size={16} fill="currentColor" />
                {content.match}% Match
              </span>
              <span className="detail-year">{content.year}</span>
              <span className="detail-rating">{content.rating}</span>
              <span className="detail-duration">{content.duration}</span>
            </div>
            
            <p className="detail-description">
              {content.description}
            </p>
            
            <div className="detail-buttons">
              <button 
                className="btn btn-white detail-play-btn"
                onClick={handlePlayClick}
              >
                <Play size={20} fill="currentColor" />
                Play
              </button>
              <button 
                className="btn btn-secondary"
                onClick={addToMyList}
              >
                <Plus size={20} />
                My List
              </button>
              <button className="btn btn-secondary">
                <ThumbsUp size={20} />
              </button>
              <button className="btn btn-secondary">
                <ThumbsDown size={20} />
              </button>
              <button className="btn btn-secondary">
                <Share size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="detail-sections">
        <div className="detail-main">
          {content.mediaType === 'tv' && content.seasons.length > 0 && (
            <div className="episodes-section">
              <div className="section-header">
                <h2>Seasons</h2>
                <select 
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="season-selector"
                >
                  {content.seasons.map((season, index) => (
                    <option key={season.id} value={index + 1}>
                      {season.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="seasons-info">
                <p>This {content.mediaType === 'tv' ? 'TV series' : 'movie'} has {content.seasons.length} season{content.seasons.length > 1 ? 's' : ''} available.</p>
              </div>
            </div>
          )}
          
          {similar.length > 0 && (
            <div className="more-like-this-section">
              <ContentRow 
                title="More Like This" 
                items={similar}
              />
            </div>
          )}
        </div>
        
        <div className="detail-sidebar">
          <div className="cast-crew">
            <h3>Cast</h3>
            <p>{content.cast.length > 0 ? content.cast.join(', ') : 'Cast information not available'}</p>
            
            <h3>{content.mediaType === 'tv' ? 'Creator' : 'Director'}</h3>
            <p>{content.creator}</p>
            
            <h3>Genres</h3>
            <p>{content.genres.length > 0 ? content.genres.join(', ') : 'Genre information not available'}</p>
          </div>
        </div>
      </div>
      
      {showEpisodeSelector && (
        <EpisodeSelector
          showId={id}
          contentTitle={content?.title}
          onClose={() => setShowEpisodeSelector(false)}
          onEpisodeSelect={handleEpisodeSelect}
        />
      )}
    </div>
  );
}

export default MovieDetail;