import { useState, useEffect } from 'react';
import { Bell, X, Play, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import './NotificationPanel.css';

function NotificationPanel() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage or API
    const savedNotifications = JSON.parse(localStorage.getItem('viewflix-notifications') || '[]');
    
    // Add some sample notifications if none exist
    if (savedNotifications.length === 0) {
      const sampleNotifications = [
        {
          id: 1,
          type: 'new_episode',
          title: 'New Episode Available',
          message: 'Stranger Things Season 5, Episode 1 is now available',
          image: 'https://images.unsplash.com/photo-1489599511986-c2d9d8b5e8b1?w=100&h=150&fit=crop',
          contentId: 1,
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: false
        },
        {
          id: 2,
          type: 'recommendation',
          title: 'New Recommendation',
          message: 'Based on your viewing history, you might like "Dark"',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=150&fit=crop',
          contentId: 2,
          timestamp: Date.now() - 7200000, // 2 hours ago
          read: false
        },
        {
          id: 3,
          type: 'reminder',
          title: 'Continue Watching',
          message: 'You left off at 23:45 in "The Crown" Season 4',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=150&fit=crop',
          contentId: 3,
          timestamp: Date.now() - 86400000, // 1 day ago
          read: true
        },
        {
          id: 4,
          type: 'new_content',
          title: 'New Movies Added',
          message: '15 new movies have been added to ViewFlix this week',
          image: 'https://images.unsplash.com/photo-1489599511986-c2d9d8b5e8b1?w=100&h=150&fit=crop',
          contentId: null,
          timestamp: Date.now() - 172800000, // 2 days ago
          read: true
        }
      ];
      
      setNotifications(sampleNotifications);
      localStorage.setItem('viewflix-notifications', JSON.stringify(sampleNotifications));
    } else {
      setNotifications(savedNotifications);
    }
  }, []);

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('viewflix-notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    localStorage.setItem('viewflix-notifications', JSON.stringify(updatedNotifications));
  };

  const removeNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem('viewflix-notifications', JSON.stringify(updatedNotifications));
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_episode':
        return <Play size={16} />;
      case 'recommendation':
        return <Plus size={16} />;
      case 'reminder':
        return <Play size={16} />;
      case 'new_content':
        return <Plus size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <div className="notification-panel">
      <button 
        className="notification-trigger"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              <button 
                className="close-notifications"
                onClick={() => setShowNotifications(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <Bell size={32} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-image">
                      <img src={notification.image} alt="" />
                      <div className="notification-type-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="notification-text">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="notification-actions-menu">
                    {notification.contentId && (
                      <Link 
                        to={`/title/${notification.contentId}`}
                        className="notification-action"
                        onClick={() => setShowNotifications(false)}
                      >
                        View
                      </Link>
                    )}
                    <button 
                      className="notification-action remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;