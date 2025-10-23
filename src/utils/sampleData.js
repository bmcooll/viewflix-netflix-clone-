// Sample data for continue watching
export const addSampleContinueWatchingData = () => {
  const existingData = JSON.parse(localStorage.getItem('viewflix-progress') || '[]');
  
  if (existingData.length === 0) {
    const sampleData = [
      {
        id: 1,
        title: 'Stranger Things',
        image: 'https://images.unsplash.com/photo-1489599511986-c2d9d8b5e8b1?w=400&h=225&fit=crop',
        progress: {
          percentage: 65,
          duration: 3120, // 52 minutes in seconds
          watchedTime: 2028
        },
        episode: {
          season: 4,
          number: 7,
          title: 'The Massacre at Hawkins Lab'
        }
      },
      {
        id: 2,
        title: 'The Crown',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
        progress: {
          percentage: 23,
          duration: 3600, // 60 minutes
          watchedTime: 828
        },
        episode: {
          season: 6,
          number: 3,
          title: 'Dis-Moi Oui'
        }
      },
      {
        id: 3,
        title: 'Ozark',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        progress: {
          percentage: 89,
          duration: 2940, // 49 minutes
          watchedTime: 2617
        },
        episode: {
          season: 4,
          number: 14,
          title: 'A Hard Way to Go'
        }
      }
    ];
    
    localStorage.setItem('viewflix-progress', JSON.stringify(sampleData));
  }
};

// Sample data for My List
export const addSampleMyListData = () => {
  const existingData = JSON.parse(localStorage.getItem('viewflix-mylist') || '[]');
  
  if (existingData.length === 0) {
    const sampleData = [
      {
        id: 101,
        title: 'Breaking Bad',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        year: 2008,
        rating: 95,
        description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.',
        mediaType: 'tv'
      },
      {
        id: 102,
        title: 'The Godfather',
        image: 'https://images.unsplash.com/photo-1489599511986-c2d9d8b5e8b1?w=400&h=225&fit=crop',
        year: 1972,
        rating: 92,
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        mediaType: 'movie'
      },
      {
        id: 103,
        title: 'The Office',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop',
        year: 2005,
        rating: 88,
        description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
        mediaType: 'tv'
      }
    ];
    
    localStorage.setItem('viewflix-mylist', JSON.stringify(sampleData));
  }
};