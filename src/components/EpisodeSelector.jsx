import { useState, useEffect } from 'react';
import { X, Play, Info } from 'lucide-react';
import { tmdbService, getImageUrl } from '../services/tmdbApi';
import './EpisodeSelector.css';

function EpisodeSelector({ showId, onClose, onEpisodeSelect, contentTitle }) {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVShowData = async () => {
      try {
        setLoading(true);
        const response = await tmdbService.getTVShowDetails(showId);
        const tvShow = response.data;
        
        if (tvShow.seasons && tvShow.seasons.length > 0) {
          // Filter out season 0 (specials) and get regular seasons
          const regularSeasons = tvShow.seasons.filter(season => season.season_number > 0);
          setSeasons(regularSeasons);
          
          if (regularSeasons.length > 0) {
            setSelectedSeason(regularSeasons[0].season_number);
            await fetchSeasonEpisodes(showId, regularSeasons[0].season_number);
          }
        }
      } catch (error) {
        console.error('Error fetching TV show data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (showId) {
      fetchTVShowData();
    }
  }, [showId]);

  const fetchSeasonEpisodes = async (tvId, seasonNumber) => {
    try {
      const response = await tmdbService.getTVSeasonDetails(tvId, seasonNumber);
      const seasonData = response.data;
      
      if (seasonData.episodes) {
        const formattedEpisodes = seasonData.episodes.map(episode => ({
          id: episode.id,
          episodeNumber: episode.episode_number,
          name: episode.name,
          overview: episode.overview,
          stillPath: episode.still_path,
          airDate: episode.air_date,
          runtime: episode.runtime,
          voteAverage: episode.vote_average
        }));
        setEpisodes(formattedEpisodes);
      }
    } catch (error) {
      console.error('Error fetching season episodes:', error);
      setEpisodes([]);
    }
  };

  const handleSeasonChange = async (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setEpisodes([]);
    await fetchSeasonEpisodes(showId, seasonNumber);
  };

  const handleEpisodeSelect = (episode) => {
    onEpisodeSelect({
      showId,
      seasonNumber: selectedSeason,
      episodeNumber: episode.episodeNumber,
      episodeId: episode.id,
      episodeName: episode.name,
      showTitle: contentTitle
    });
    onClose();
  };

  const formatRuntime = (runtime) => {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="episode-selector-overlay">
        <div className="episode-selector-modal">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading episodes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="episode-selector-overlay" onClick={onClose}>
      <div className="episode-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select Episode - {contentTitle}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="season-selector">
          <label>Season:</label>
          <select 
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(Number(e.target.value))}
          >
            {seasons.map(season => (
              <option key={season.id} value={season.season_number}>
                {season.name} ({season.episode_count} episodes)
              </option>
            ))}
          </select>
        </div>

        <div className="episodes-grid">
          {episodes.length === 0 ? (
            <div className="no-episodes">
              <p>No episodes available for this season</p>
            </div>
          ) : (
            episodes.map((episode) => (
              <div 
                key={episode.id} 
                className="episode-card"
                onClick={() => handleEpisodeSelect(episode)}
              >
                <div className="episode-thumbnail">
                  <img 
                    src={getImageUrl(episode.stillPath, 'w300')} 
                    alt={episode.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x169/333/fff?text=No+Image';
                    }}
                  />
                  <div className="episode-overlay">
                    <button className="episode-play-btn">
                      <Play size={20} fill="currentColor" />
                    </button>
                  </div>
                  <div className="episode-number">{episode.episodeNumber}</div>
                </div>
                
                <div className="episode-info">
                  <h3 className="episode-title">{episode.name}</h3>
                  <div className="episode-meta">
                    <span className="episode-runtime">{formatRuntime(episode.runtime)}</span>
                    {episode.voteAverage > 0 && (
                      <span className="episode-rating">
                        ⭐ {episode.voteAverage.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p className="episode-description">
                    {episode.overview || 'No description available.'}
                  </p>
                  {episode.airDate && (
                    <div className="episode-air-date">
                      Aired: {new Date(episode.airDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EpisodeSelector;