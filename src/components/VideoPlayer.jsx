import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  ArrowLeft,
  Settings,
  Subtitles
} from 'lucide-react';
import { getVideoSource } from '../utils/videoSources';
import { tmdbService } from '../services/tmdbApi';
import './VideoPlayer.css';

function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  
  // Get episode data from navigation state
  const episodeData = location.state?.episodeData;
  const contentType = location.state?.contentType || 'movie';

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [contentInfo, setContentInfo] = useState(null);
  const [videoSource, setVideoSource] = useState(null);

  useEffect(() => {
    const fetchContentAndVideo = async () => {
      try {
        let contentTitle = '';
        
        // Fetch actual content details from TMDB
        if (episodeData) {
          contentTitle = episodeData.showTitle;
        } else {
          // Try to fetch movie details
          try {
            const movieResponse = await tmdbService.getMovieDetails(id);
            contentTitle = movieResponse.data.title;
          } catch (movieError) {
            try {
              const tvResponse = await tmdbService.getTVShowDetails(id);
              contentTitle = tvResponse.data.name;
            } catch (tvError) {
              contentTitle = 'Unknown Content';
            }
          }
        }
        
        // Get video source with actual content title
        const source = getVideoSource(id, episodeData, contentTitle);
        setVideoSource(source);
        setContentInfo({
          title: source.title,
          subtitle: source.subtitle,
          type: episodeData ? 'episode' : 'movie',
          description: source.description,
          isDemo: source.isDemo,
          notAvailable: source.notAvailable
        });
      } catch (error) {
        console.error('Error fetching content details:', error);
        // Fallback to basic info
        const source = getVideoSource(id, episodeData, episodeData?.showTitle || 'Unknown Content');
        setVideoSource(source);
        setContentInfo({
          title: source.title,
          subtitle: source.subtitle,
          type: episodeData ? 'episode' : 'movie',
          description: source.description,
          isDemo: source.isDemo,
          notAvailable: source.notAvailable
        });
      }
    };

    fetchContentAndVideo();
  }, [id, episodeData]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSource?.isTrailer) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    // Auto-play the video when component mounts
    video.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.log('Auto-play prevented:', error);
    });

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [videoSource]);

  useEffect(() => {
    let timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const togglePlay = () => {
    if (videoSource?.isTrailer) return; // YouTube handles its own controls
    
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (videoSource?.isTrailer) return;
    
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const toggleMute = () => {
    if (videoSource?.isTrailer) return;
    
    const video = videoRef.current;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    if (videoSource?.isTrailer) return;
    
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const skip = (seconds) => {
    if (videoSource?.isTrailer) return;
    
    const video = videoRef.current;
    video.currentTime += seconds;
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const changePlaybackSpeed = (speed) => {
    if (videoSource?.isTrailer) return;
    
    const video = videoRef.current;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  return (
    <div 
      className="video-player"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {videoSource?.isTrailer ? (
        <iframe
          className="video-element trailer-iframe"
          src={videoSource.src}
          title={videoSource.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          className="video-element"
          poster={videoSource?.poster}
          onClick={togglePlay}
        >
          {videoSource && (
            <source src={videoSource.src} type="video/mp4" />
          )}
          Your browser does not support the video tag.
        </video>
      )}

      <div className={`video-controls ${showControls ? 'visible' : ''} ${videoSource?.isTrailer ? 'trailer-mode' : ''}`}>
        <div className="video-header">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </button>
          
          {contentInfo && (
            <div className="content-title">
              <h2>{contentInfo.title}</h2>
              {contentInfo.subtitle && <p>{contentInfo.subtitle}</p>}
              {contentInfo.isDemo && (
                <div className="demo-notice">
                  {videoSource?.isTrailer ? (
                    <>
                      <span className="demo-badge trailer-badge">TRAILER</span>
                      <span className="demo-text">Official movie trailer - Real content!</span>
                    </>
                  ) : (
                    <>
                      <span className="demo-badge">DEMO</span>
                      {contentInfo.notAvailable ? (
                        <span className="demo-text">Content not available - showing sample video</span>
                      ) : (
                        <span className="demo-text">Playing demo video for this content</span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {!videoSource?.isTrailer && (
          <div className="controls-bottom">
            <div className="progress-container">
              <div 
                className="progress-bar"
                onClick={handleSeek}
              >
                <div 
                  className="progress-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            <div className="controls-row">
              <div className="controls-left">
                <button onClick={togglePlay} className="control-btn">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                
                <button onClick={() => skip(-10)} className="control-btn">
                  <SkipBack size={20} />
                </button>
                
                <button onClick={() => skip(10)} className="control-btn">
                  <SkipForward size={20} />
                </button>

                <div className="volume-control">
                  <button onClick={toggleMute} className="control-btn">
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>

                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="controls-right">
                <button className="control-btn">
                  <Subtitles size={20} />
                </button>
                
                <div className="settings-container">
                  <button 
                    className="control-btn"
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <Settings size={20} />
                  </button>
                  
                  {showSettings && (
                    <div className="settings-menu">
                      <div className="settings-section">
                        <h4>Playback Speed</h4>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                          <button
                            key={speed}
                            className={`settings-option ${playbackSpeed === speed ? 'active' : ''}`}
                            onClick={() => changePlaybackSpeed(speed)}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                      <div className="settings-section">
                        <h4>Quality</h4>
                        {['480p', '720p', '1080p', '4K'].map(q => (
                          <button
                            key={q}
                            className={`settings-option ${quality === q ? 'active' : ''}`}
                            onClick={() => setQuality(q)}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={toggleFullscreen} className="control-btn">
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;