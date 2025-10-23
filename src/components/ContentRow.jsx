import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from './Toast';
import EpisodeSelector from './EpisodeSelector';
import './ContentRow.css';

function ContentRow({ title, items, isLarge = false }) {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const rowRef = useRef(null);

  const handlePlayClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item.mediaType === 'tv') {
      setSelectedItem(item);
      setShowEpisodeSelector(true);
    } else {
      navigate(`/watch/${item.id}`);
    }
  };

  const handleEpisodeSelect = (episodeData) => {
    navigate(`/watch/${selectedItem.id}`, { 
      state: { 
        episodeData,
        contentType: 'tv'
      } 
    });
    setShowEpisodeSelector(false);
    setSelectedItem(null);
  };

  const addToMyList = (item) => {
    const existingList = JSON.parse(localStorage.getItem('viewflix-mylist') || '[]');
    const isAlreadyInList = existingList.some(listItem => listItem.id === item.id);
    
    if (!isAlreadyInList) {
      const updatedList = [...existingList, item];
      localStorage.setItem('viewflix-mylist', JSON.stringify(updatedList));
      showToast(`Added "${item.title}" to My List`, 'success');
    } else {
      showToast(`"${item.title}" is already in My List`, 'info');
    }
  };

  const scroll = (direction) => {
    const container = rowRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const handleMouseEnter = (item, index) => {
    setHoveredItem({ ...item, index });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        {scrollPosition > 0 && (
          <button 
            className="scroll-btn scroll-btn-left"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        <div 
          className={`row-items ${isLarge ? 'large' : ''}`}
          ref={rowRef}
          onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`row-item ${hoveredItem?.index === index ? 'hovered' : ''}`}
              onMouseEnter={() => handleMouseEnter(item, index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={`/title/${item.id}`} className="item-link">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                  {hoveredItem?.index === index && (
                    <div className="item-overlay">
                      <div className="overlay-content">
                        <div className="overlay-buttons">
                          <button 
                            className="overlay-btn play-btn"
                            onClick={(e) => handlePlayClick(e, item)}
                          >
                            <Play size={16} fill="currentColor" />
                          </button>
                          <button 
                            className="overlay-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              addToMyList(item);
                            }}
                          >
                            <Plus size={16} />
                          </button>
                          <button className="overlay-btn">
                            <ThumbsUp size={16} />
                          </button>
                          <button className="overlay-btn more-btn">
                            <ChevronDown size={16} />
                          </button>
                        </div>
                        <div className="overlay-info">
                          <h3 className="overlay-title">{item.title}</h3>
                          <div className="overlay-meta">
                            <span className="match">{item.match}% Match</span>
                            <span className="rating">{item.rating}</span>
                            <span className="duration">{item.duration}</span>
                          </div>
                          <div className="overlay-genres">
                            {item.genres?.map((genre, i) => (
                              <span key={i} className="genre">{genre}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        <button 
          className="scroll-btn scroll-btn-right"
          onClick={() => scroll('right')}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {showEpisodeSelector && selectedItem && (
        <EpisodeSelector
          showId={selectedItem.id}
          contentTitle={selectedItem.title}
          onClose={() => {
            setShowEpisodeSelector(false);
            setSelectedItem(null);
          }}
          onEpisodeSelect={handleEpisodeSelect}
        />
      )}
    </div>
  );
}

export default ContentRow;