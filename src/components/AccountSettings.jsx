import { useState } from 'react';
import Navigation from './Navigation';
import { User, CreditCard, Shield, Bell, Download, Globe, Eye, EyeOff } from 'lucide-react';
import './AccountSettings.css';

function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      language: 'English',
      country: 'United States'
    },
    notifications: {
      newReleases: true,
      recommendations: true,
      watchReminders: false,
      emailNotifications: true,
      pushNotifications: true
    },
    playback: {
      autoplay: true,
      autoplayPreviews: false,
      dataUsage: 'auto',
      subtitles: 'off',
      audioLanguage: 'English'
    },
    parental: {
      enabled: false,
      pin: '',
      maturityRating: 'TV-MA'
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'playback', label: 'Playback', icon: Download },
    { id: 'parental', label: 'Parental Controls', icon: Shield },
  ];

  const renderProfileTab = () => (
    <div className="settings-section">
      <h2>Profile Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={settings.profile.name}
            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={settings.profile.phone}
            onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Language</label>
          <select
            value={settings.profile.language}
            onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="German">Deutsch</option>
            <option value="Italian">Italiano</option>
          </select>
        </div>
        <div className="form-group">
          <label>Country</label>
          <select
            value={settings.profile.country}
            onChange={(e) => handleSettingChange('profile', 'country', e.target.value)}
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      </div>
      
      <div className="password-section">
        <h3>Change Password</h3>
        <div className="form-group">
          <label>Current Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
          />
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="settings-section">
      <h2>Billing & Subscription</h2>
      
      <div className="subscription-info">
        <div className="plan-card current-plan">
          <h3>Premium Plan</h3>
          <div className="plan-price">$15.99/month</div>
          <div className="plan-features">
            <ul>
              <li>4K Ultra HD</li>
              <li>Watch on 4 devices</li>
              <li>Download on 6 devices</li>
              <li>No ads</li>
            </ul>
          </div>
          <div className="plan-status">
            <span className="status-badge active">Active</span>
            <span className="next-billing">Next billing: Dec 15, 2024</span>
          </div>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Payment Methods</h3>
        <div className="payment-card">
          <div className="card-info">
            <CreditCard size={24} />
            <div>
              <div className="card-number">•••• •••• •••• 4242</div>
              <div className="card-details">Visa • Expires 12/26</div>
            </div>
          </div>
          <button className="btn-secondary">Update</button>
        </div>
        <button className="btn-outline">Add Payment Method</button>
      </div>

      <div className="billing-history">
        <h3>Billing History</h3>
        <div className="history-list">
          <div className="history-item">
            <span>Nov 15, 2024</span>
            <span>Premium Plan</span>
            <span>$15.99</span>
            <button className="btn-link">Download</button>
          </div>
          <div className="history-item">
            <span>Oct 15, 2024</span>
            <span>Premium Plan</span>
            <span>$15.99</span>
            <button className="btn-link">Download</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h2>Notification Preferences</h2>
      <div className="toggle-list">
        <div className="toggle-item">
          <div className="toggle-info">
            <h4>New Releases</h4>
            <p>Get notified when new movies and shows are added</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.newReleases}
              onChange={(e) => handleSettingChange('notifications', 'newReleases', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Recommendations</h4>
            <p>Receive personalized content recommendations</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.recommendations}
              onChange={(e) => handleSettingChange('notifications', 'recommendations', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Watch Reminders</h4>
            <p>Reminders for shows you're currently watching</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.watchReminders}
              onChange={(e) => handleSettingChange('notifications', 'watchReminders', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="toggle-item">
          <div className="toggle-info">
            <h4>Email Notifications</h4>
            <p>Receive notifications via email</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPlaybackTab = () => (
    <div className="settings-section">
      <h2>Playback Settings</h2>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Autoplay next episode</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.playback.autoplay}
              onChange={(e) => handleSettingChange('playback', 'autoplay', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <label>Autoplay previews</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.playback.autoplayPreviews}
              onChange={(e) => handleSettingChange('playback', 'autoplayPreviews', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="setting-item">
          <label>Data usage per screen</label>
          <select
            value={settings.playback.dataUsage}
            onChange={(e) => handleSettingChange('playback', 'dataUsage', e.target.value)}
          >
            <option value="low">Low (0.3 GB per hour)</option>
            <option value="medium">Medium (0.7 GB per hour)</option>
            <option value="high">High (3 GB per hour)</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        
        <div className="setting-item">
          <label>Subtitle appearance</label>
          <select
            value={settings.playback.subtitles}
            onChange={(e) => handleSettingChange('playback', 'subtitles', e.target.value)}
          >
            <option value="off">Off</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderParentalTab = () => (
    <div className="settings-section">
      <h2>Parental Controls</h2>
      <div className="parental-controls">
        <div className="setting-item">
          <div className="setting-info">
            <h4>Enable Parental Controls</h4>
            <p>Restrict content based on maturity ratings</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.parental.enabled}
              onChange={(e) => handleSettingChange('parental', 'enabled', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        {settings.parental.enabled && (
          <>
            <div className="form-group">
              <label>Parental Control PIN</label>
              <input
                type="password"
                placeholder="Enter 4-digit PIN"
                maxLength="4"
                value={settings.parental.pin}
                onChange={(e) => handleSettingChange('parental', 'pin', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Maximum Maturity Rating</label>
              <select
                value={settings.parental.maturityRating}
                onChange={(e) => handleSettingChange('parental', 'maturityRating', e.target.value)}
              >
                <option value="G">G - General Audiences</option>
                <option value="PG">PG - Parental Guidance</option>
                <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                <option value="R">R - Restricted</option>
                <option value="TV-MA">TV-MA - Mature Audiences</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'billing':
        return renderBillingTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'playback':
        return renderPlaybackTab();
      case 'parental':
        return renderParentalTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="account-settings">
      <Navigation />
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <h1>Account Settings</h1>
          <nav className="settings-nav">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="settings-content">
          {renderTabContent()}
          
          <div className="settings-actions">
            <button className="btn-primary">Save Changes</button>
            <button className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;