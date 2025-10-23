// Video source mapping for demonstration
// In a real streaming app, this would connect to your video CDN/streaming service

// Map of specific content IDs to their YouTube trailer URLs
const contentVideoMap = {
  // Popular Movies (using their TMDB IDs) - Real YouTube Trailers
  '550': { // Fight Club
    src: 'https://www.youtube.com/embed/qtRKdVHc-cE?autoplay=1&controls=1&rel=0',
    title: 'Fight Club',
    description: 'Official trailer for Fight Club - A psychological thriller about an underground fight club',
    isTrailer: true
  },
  '13': { // Forrest Gump
    src: 'https://www.youtube.com/embed/bLvqoHBptjg?autoplay=1&controls=1&rel=0',
    title: 'Forrest Gump',
    description: 'Official trailer for Forrest Gump - The story of a man with a low IQ who accomplishes great things',
    isTrailer: true
  },
  '238': { // The Godfather
    src: 'https://www.youtube.com/embed/sY1S34973zA?autoplay=1&controls=1&rel=0',
    title: 'The Godfather',
    description: 'Official trailer for The Godfather - The aging patriarch of a crime dynasty transfers control to his son',
    isTrailer: true
  },
  '278': { // The Shawshank Redemption
    src: 'https://www.youtube.com/embed/6hB3S9bIaco?autoplay=1&controls=1&rel=0',
    title: 'The Shawshank Redemption',
    description: 'Official trailer for The Shawshank Redemption - Two imprisoned men bond over years, finding solace and redemption',
    isTrailer: true
  },
  '680': { // Pulp Fiction
    src: 'https://www.youtube.com/embed/s7EdQ4FqbhY?autoplay=1&controls=1&rel=0',
    title: 'Pulp Fiction',
    description: 'Official trailer for Pulp Fiction - The lives of two mob hitmen, a boxer, and others intertwine',
    isTrailer: true
  },
  '155': { // The Dark Knight
    src: 'https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&controls=1&rel=0',
    title: 'The Dark Knight',
    description: 'Official trailer for The Dark Knight - Batman faces the Joker in this epic superhero thriller',
    isTrailer: true
  },
  '424': { // Schindler's List
    src: 'https://www.youtube.com/embed/gG22XNhtnoY?autoplay=1&controls=1&rel=0',
    title: 'Schindler\'s List',
    description: 'Official trailer for Schindler\'s List - A businessman saves lives during the Holocaust',
    isTrailer: true
  },
  '27205': { // Inception
    src: 'https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1&controls=1&rel=0',
    title: 'Inception',
    description: 'Official trailer for Inception - A thief enters people\'s dreams to steal secrets',
    isTrailer: true
  },
  '157336': { // Interstellar
    src: 'https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&controls=1&rel=0',
    title: 'Interstellar',
    description: 'Official trailer for Interstellar - A team of explorers travel through a wormhole in space',
    isTrailer: true
  },
  '299536': { // Avengers: Infinity War
    src: 'https://www.youtube.com/embed/6ZfuNTqbHE8?autoplay=1&controls=1&rel=0',
    title: 'Avengers: Infinity War',
    description: 'Official trailer for Avengers: Infinity War - The Avengers face their greatest threat',
    isTrailer: true
  },
  
  // Popular TV Shows - Real YouTube Trailers
  '1399': { // Game of Thrones
    src: 'https://www.youtube.com/embed/rlR4PJn8b8I?autoplay=1&controls=1&rel=0',
    title: 'Game of Thrones',
    description: 'Official trailer for Game of Thrones - Epic fantasy series about power struggles in Westeros',
    isTrailer: true
  },
  '1396': { // Breaking Bad
    src: 'https://www.youtube.com/embed/HhesaQXLuRY?autoplay=1&controls=1&rel=0',
    title: 'Breaking Bad',
    description: 'Official trailer for Breaking Bad - A chemistry teacher turns to making drugs',
    isTrailer: true
  },
  '66732': { // Stranger Things
    src: 'https://www.youtube.com/embed/b9EkMc79ZSU?autoplay=1&controls=1&rel=0',
    title: 'Stranger Things',
    description: 'Official trailer for Stranger Things - Kids in a small town encounter supernatural forces',
    isTrailer: true
  },
  '1418': { // The Big Bang Theory
    src: 'https://www.youtube.com/embed/WBb3fojgW0Q?autoplay=1&controls=1&rel=0',
    title: 'The Big Bang Theory',
    description: 'Official trailer for The Big Bang Theory - Comedy about physicists and their social lives',
    isTrailer: true
  },
  '60735': { // The Flash
    src: 'https://www.youtube.com/embed/Yj0l7iGKh8g?autoplay=1&controls=1&rel=0',
    title: 'The Flash',
    description: 'Official trailer for The Flash - A forensic scientist gains super-speed powers',
    isTrailer: true
  },
  '1402': { // The Walking Dead
    src: 'https://www.youtube.com/embed/sfAc2U20uyg?autoplay=1&controls=1&rel=0',
    title: 'The Walking Dead',
    description: 'Official trailer for The Walking Dead - Survivors navigate a zombie apocalypse',
    isTrailer: true
  },
  '94605': { // Arcane
    src: 'https://www.youtube.com/embed/fXmAurh012s?autoplay=1&controls=1&rel=0',
    title: 'Arcane',
    description: 'Official trailer for Arcane - Animated series set in the League of Legends universe',
    isTrailer: true
  },
  '85271': { // WandaVision
    src: 'https://www.youtube.com/embed/sj9J2ecsSpo?autoplay=1&controls=1&rel=0',
    title: 'WandaVision',
    description: 'Official trailer for WandaVision - Wanda and Vision live in a suburban sitcom world',
    isTrailer: true
  }
};

// Fallback videos for content not in our trailer library
const fallbackVideos = [
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    title: 'Content Not Available',
    description: 'This content doesn\'t have a trailer in our demo library'
  },
  {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    title: 'Demo Content',
    description: 'Sample video - Real streaming service would play the actual content'
  }
];

export const getVideoSource = (contentId, episodeData = null, contentTitle = '') => {
  // Check if we have a specific video for this content
  const mappedContent = contentVideoMap[contentId];
  
  if (mappedContent) {
    // We have a specific video for this content
    if (episodeData) {
      return {
        src: mappedContent.src,
        poster: `https://images.unsplash.com/photo-1489599511986-c2d9d8b5e8b1?w=1920&h=1080&fit=crop`,
        title: `${episodeData.showTitle} - S${episodeData.seasonNumber}:E${episodeData.episodeNumber}`,
        subtitle: episodeData.episodeName,
        description: `Episode ${episodeData.episodeNumber} of ${episodeData.showTitle}`,
        isDemo: true
      };
    } else {
      return {
        src: mappedContent.src,
        poster: `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop`,
        title: mappedContent.title,
        subtitle: '',
        description: mappedContent.description,
        isDemo: true
      };
    }
  }
  
  // Content not in our library - show appropriate message
  const fallbackIndex = parseInt(contentId) % fallbackVideos.length;
  const fallback = fallbackVideos[fallbackIndex];
  
  if (episodeData) {
    return {
      src: fallback.src,
      poster: `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop`,
      title: `${episodeData.showTitle} - S${episodeData.seasonNumber}:E${episodeData.episodeNumber}`,
      subtitle: episodeData.episodeName,
      description: `This episode is not available in our demo library. In a real streaming service, this would play "${episodeData.episodeName}".`,
      isDemo: true,
      notAvailable: true
    };
  } else {
    return {
      src: fallback.src,
      poster: `https://images.unsplash.com/photo-1489599511986-c2d9d8b5e8b1?w=1920&h=1080&fit=crop`,
      title: contentTitle || 'Content Not Available',
      subtitle: '',
      description: `This content is not available in our demo library. In a real streaming service, this would play "${contentTitle}".`,
      isDemo: true,
      notAvailable: true
    };
  }
};

// Get poster image for video
export const getVideoPoster = (contentId, episodeData = null) => {
  if (episodeData) {
    const episodeIndex = (episodeData.seasonNumber * 10 + episodeData.episodeNumber) % 10;
    return `https://images.unsplash.com/photo-${1500000000000 + episodeIndex}?w=1920&h=1080&fit=crop`;
  }
  
  const movieIndex = parseInt(contentId) % 10;
  return `https://images.unsplash.com/photo-${1500000000000 + movieIndex}?w=1920&h=1080&fit=crop`;
};

// Simulate different video qualities
export const getVideoQualities = (baseUrl) => {
  return {
    '480p': baseUrl,
    '720p': baseUrl,
    '1080p': baseUrl,
    '4K': baseUrl
  };
};

export default { getVideoSource, getVideoPoster, getVideoQualities };