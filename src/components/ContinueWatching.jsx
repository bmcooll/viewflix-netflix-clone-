import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, X } from 'lucide-react';
import './ContinueWatching.css';

function ContinueWatching() {
  const [continueWatchingList, setContinueWatchingList] = useState([]);

  useEffect(() => {
    // Load continue watching data from localStorage
    const savedProgress = JSON.parse(localStorage.getItem('viewflix-progress') || '[]');
    setContinueWatchingList(savedProgress);
  }, []);

  const removeFromContinueWatching = (itemId) => {
    const updatedList = continueWatchingList.filter(item => item.id !== itemId);
    setContinueWatchingList(updatedList);
    localStorage.setItem('viewflix-progress', JSON.stringify(updatedList));
  };

  const formatProgress = (progress) => {
    const totalMinutes = Math.floor(progress.duration / 60);
    const watchedMinutes = Math.floor((progress.duration * progress.percentage) / 60);
    return `${watchedMinutes} of ${totalMinutes} min`;
  };

  if (continueWatchingList.length === 0) {
    return null;
  }

  return (
    <div className="continue-watching-section">
      <h2 className="section-title">Continue Watching for Alex</h2>
      <div className="continue-watching-grid">
        {continueWatchingList.map((item) => (
          <div key={item.id} className="continue-watching-item">
            <div className="item-container">
              <Link to={`/watch/${item.id}`} className="item-link">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                  <div className="play-overlay">
                    <div className="play-button">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                  <div className="progress-overlay">
                    <div 
                      className="progress-bar"
                      style={{ width: `${item.progress.percentage}%` }}
                    />
                  </div>
                </div>
              </Link>
              
              <button 
                className="remove-button"
                onClick={() => removeFromContinueWatching(item.id)}
                title="Remove from Continue Watching"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="item-info">
              <h3 className="item-title">{item.title}</h3>
              <div className="item-meta">
                <span className="progress-text">
                  {formatProgress(item.progress)}
                </span>
                {item.episode && (
                  <span className="episode-info">
                    S{item.episode.season}:E{item.episode.number} - {item.episode.title}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContinueWatching;