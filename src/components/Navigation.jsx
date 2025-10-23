import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import './Navigation.css';

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo-text">VIEWFLIX</span>
          </Link>
          <ul className="nav-links">
            <li><Link to="/" className="nav-link active">Home</Link></li>
            <li><Link to="/tv-shows" className="nav-link">TV Shows</Link></li>
            <li><Link to="/movies" className="nav-link">Movies</Link></li>
            <li><Link to="/new-popular" className="nav-link">New & Popular</Link></li>
            <li><Link to="/my-list" className="nav-link">My List</Link></li>
            <li><Link to="/browse-languages" className="nav-link">Browse by Languages</Link></li>
          </ul>
        </div>
        
        <div className="nav-right">
          <div className="search-container">
            {showSearch ? (
              <form onSubmit={handleSearch} className="search-form">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                  onBlur={() => !searchQuery && setShowSearch(false)}
                />
              </form>
            ) : (
              <button 
                className="search-btn"
                onClick={() => setShowSearch(true)}
              >
                <Search size={20} />
              </button>
            )}
          </div>
          
          <NotificationPanel />
          
          <div className="profile-menu">
            <button className="profile-btn">
              <div className="profile-avatar-small">👤</div>
              <ChevronDown size={16} />
            </button>
            <div className="profile-dropdown">
              <Link to="/account" className="dropdown-item">Account Settings</Link>
              <Link to="/profiles" className="dropdown-item">Manage Profiles</Link>
              <Link to="/help" className="dropdown-item">Help Center</Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item sign-out">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;