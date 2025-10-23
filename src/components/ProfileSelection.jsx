import { useState } from 'react';
import './ProfileSelection.css';

const profiles = [
  { id: 1, name: 'Alex', avatar: '👤', color: '#e50914' },
  { id: 2, name: 'Samantha', avatar: '👩', color: '#46d369' },
  { id: 3, name: 'Something', avatar: '🧑', color: '#ffa500' },
  { id: 4, name: 'Kids', avatar: '👶', color: '#00d4ff' },
  { id: 5, name: 'Kids', avatar: '🧒', color: '#9932cc' }
];

function ProfileSelection({ onProfileSelect }) {
  const [hoveredProfile, setHoveredProfile] = useState(null);

  return (
    <div className="profile-selection">
      <div className="profile-container">
        <h1 className="profile-title">Who's watching ViewFlix?</h1>
        <div className="profiles-grid">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`profile-item ${hoveredProfile === profile.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
              onClick={() => onProfileSelect(profile)}
            >
              <div 
                className="profile-avatar"
                style={{ backgroundColor: profile.color }}
              >
                <span className="avatar-emoji">{profile.avatar}</span>
              </div>
              <span className="profile-name">{profile.name}</span>
            </div>
          ))}
          <div className="profile-item add-profile">
            <div className="profile-avatar add-avatar">
              <span className="add-icon">+</span>
            </div>
            <span className="profile-name">Add Profile</span>
          </div>
        </div>
        <button className="manage-profiles-btn">Manage Profiles</button>
      </div>
    </div>
  );
}

export default ProfileSelection;