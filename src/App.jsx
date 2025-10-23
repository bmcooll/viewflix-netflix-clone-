import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProfileSelection from './components/ProfileSelection';
import HomePage from './components/HomePage';
import MovieDetail from './components/MovieDetail';
import SearchPage from './components/SearchPage';
import TVShowsPage from './components/TVShowsPage';
import MoviesPage from './components/MoviesPage';
import NewPopularPage from './components/NewPopularPage';
import MyListPage from './components/MyListPage';
import VideoPlayer from './components/VideoPlayer';
import AccountSettings from './components/AccountSettings';
import ToastContainer from './components/Toast';
import DemoExplanation from './components/DemoExplanation';
import './App.css';

function App() {
  const [selectedProfile, setSelectedProfile] = useState(null);

  if (!selectedProfile) {
    return <ProfileSelection onProfileSelect={setSelectedProfile} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tv-shows" element={<TVShowsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/new-popular" element={<NewPopularPage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/title/:id" element={<MovieDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/watch/:id" element={<VideoPlayer />} />
          <Route path="/account" element={<AccountSettings />} />
        </Routes>
        <ToastContainer />
        <DemoExplanation />
      </div>
    </Router>
  );
}

export default App;