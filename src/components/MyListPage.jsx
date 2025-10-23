import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { Play, X, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MyListPage.css';

function MyListPage() {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading my list from localStorage or API
    const loadMyList = () => {
      setLoading(true);
      setTimeout(() => {
        const savedList = JSON.parse(localStorage.getItem('viewflix-mylist') || '[]');
        setMyList(savedList);
        setLoading(false);
      }, 500);
    };

    loadMyList();
  }, []);

  const removeFromList = (itemId) => {
    const updatedList = myList.filter(item => item.id !== itemId);
    setMyList(updatedList);
    localStorage.setItem('viewflix-mylist', JSON.stringify(updatedList));
  };

  if (loading) {
    return (
      <div className="my-list-page">
        <Navigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading My List...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-list-page">
      <Navigation />
      
      <div className="my-list-hero">
        <div className="hero-content">
          <h1>My List</h1>
          <p>Your personal collection of movies and TV shows</p>
        </div>
      </div>
      
      <div className="my-list-content">
        {myList.length === 0 ? (
          <div className="empty-list">
            <div className="empty-icon">📺</div>
            <h2>Your list is empty</h2>
            <p>Add movies and TV shows to your list to watch them later</p>
            <Link to="/" className="browse-btn">
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="list-grid">
            {myList.map((item) => (
              <div key={item.id} className="list-item">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                  <div className="item-overlay">
                    <div className="overlay-buttons">
                      <Link to={`/title/${item.id}`} className="overlay-btn play-btn">
                        <Play size={20} fill="currentColor" />
                      </Link>
                      <Link to={`/title/${item.id}`} className="overlay-btn info-btn">
                        <Info size={20} />
                      </Link>
                      <button 
                        className="overlay-btn remove-btn"
                        onClick={() => removeFromList(item.id)}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-meta">
                    <span className="item-year">{item.year}</span>
                    <span className="item-rating">{item.rating}% Match</span>
                  </div>
                  <p className="item-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListPage;