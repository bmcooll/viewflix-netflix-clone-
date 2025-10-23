import { useState } from 'react';
import { Info, X, ExternalLink } from 'lucide-react';
import './DemoExplanation.css';

function DemoExplanation() {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <>
      <button 
        className="demo-info-trigger"
        onClick={() => setShowExplanation(true)}
        title="About Demo Videos"
      >
        <Info size={16} />
        Demo Info
      </button>

      {showExplanation && (
        <div className="demo-explanation-overlay" onClick={() => setShowExplanation(false)}>
          <div className="demo-explanation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>About ViewFlix Demo</h2>
              <button 
                className="close-button"
                onClick={() => setShowExplanation(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="explanation-section">
                <h3>🎬 Why Sample Videos?</h3>
                <p>
                  ViewFlix is a <strong>demonstration project</strong> that replicates Netflix's interface and functionality. 
                  We use sample videos because:
                </p>
                <ul>
                  <li><strong>Copyright Protection:</strong> Real movies/TV shows are protected by copyright</li>
                  <li><strong>Licensing Costs:</strong> Streaming rights cost millions of dollars</li>
                  <li><strong>Legal Compliance:</strong> Only licensed platforms can stream copyrighted content</li>
                </ul>
              </div>

              <div className="explanation-section">
                <h3>🔧 How It Works</h3>
                <p>Our enhanced demo system:</p>
                <ul>
                  <li><strong>Real Data:</strong> Uses actual movie/TV data from The Movie Database (TMDB)</li>
                  <li><strong>Real Trailers:</strong> Popular content plays actual YouTube trailers</li>
                  <li><strong>Episode Selection:</strong> TV series show real episode data and selection</li>
                  <li><strong>Smart Fallback:</strong> Content without trailers shows sample videos with explanations</li>
                  <li><strong>Full Features:</strong> All Netflix-like features work (My List, Continue Watching, etc.)</li>
                </ul>
              </div>

              <div className="explanation-section">
                <h3>🎯 What You're Seeing</h3>
                <div className="demo-types">
                  <div className="demo-type">
                    <span className="demo-badge trailer">TRAILER</span>
                    <div>
                      <strong>Popular Content:</strong> Real YouTube trailers for popular movies/shows like Fight Club, Breaking Bad, Game of Thrones
                    </div>
                  </div>
                  <div className="demo-type">
                    <span className="demo-badge not-available">DEMO</span>
                    <div>
                      <strong>Other Content:</strong> Sample videos with explanation that full content isn't available
                    </div>
                  </div>
                </div>
              </div>

              <div className="explanation-section">
                <h3>🚀 Real Implementation</h3>
                <p>In a production streaming service, this would connect to:</p>
                <ul>
                  <li><strong>Video CDN:</strong> Content Delivery Network with actual movies/shows</li>
                  <li><strong>DRM System:</strong> Digital Rights Management for content protection</li>
                  <li><strong>Licensing Database:</strong> User's subscription and regional availability</li>
                  <li><strong>Analytics:</strong> Viewing history and recommendations</li>
                </ul>
              </div>

              <div className="explanation-section">
                <h3>🔗 Technologies Used</h3>
                <div className="tech-list">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">TMDB API</span>
                  <span className="tech-tag">React Router</span>
                  <span className="tech-tag">CSS3</span>
                  <span className="tech-tag">LocalStorage</span>
                  <span className="tech-tag">Responsive Design</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="tmdb-link"
              >
                <ExternalLink size={16} />
                Data provided by TMDB
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DemoExplanation;