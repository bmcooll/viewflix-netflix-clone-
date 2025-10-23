import axios from 'axios';

// TMDB API configuration
const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // Demo API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Helper function to get image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750/333/fff?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Helper function to get backdrop URL
export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return 'https://via.placeholder.com/1280x720/333/fff?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API endpoints
export const tmdbService = {
  // Trending content
  getTrending: (mediaType = 'all', timeWindow = 'week') =>
    tmdbApi.get(`/trending/${mediaType}/${timeWindow}`),

  // Popular movies
  getPopularMovies: (page = 1) =>
    tmdbApi.get('/movie/popular', { params: { page } }),

  // Popular TV shows
  getPopularTVShows: (page = 1) =>
    tmdbApi.get('/tv/popular', { params: { page } }),

  // Top rated movies
  getTopRatedMovies: (page = 1) =>
    tmdbApi.get('/movie/top_rated', { params: { page } }),

  // Top rated TV shows
  getTopRatedTVShows: (page = 1) =>
    tmdbApi.get('/tv/top_rated', { params: { page } }),

  // Now playing movies
  getNowPlayingMovies: (page = 1) =>
    tmdbApi.get('/movie/now_playing', { params: { page } }),

  // Upcoming movies
  getUpcomingMovies: (page = 1) =>
    tmdbApi.get('/movie/upcoming', { params: { page } }),

  // On the air TV shows
  getOnTheAirTVShows: (page = 1) =>
    tmdbApi.get('/tv/on_the_air', { params: { page } }),

  // Airing today TV shows
  getAiringTodayTVShows: (page = 1) =>
    tmdbApi.get('/tv/airing_today', { params: { page } }),

  // Movie details
  getMovieDetails: (movieId) =>
    tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar,recommendations'
      }
    }),

  // TV show details
  getTVShowDetails: (tvId) =>
    tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'credits,videos,similar,recommendations'
      }
    }),

  // TV show season details
  getTVSeasonDetails: (tvId, seasonNumber) =>
    tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`),

  // Search multi (movies, TV shows, people)
  searchMulti: (query, page = 1) =>
    tmdbApi.get('/search/multi', { params: { query, page } }),

  // Search movies
  searchMovies: (query, page = 1) =>
    tmdbApi.get('/search/movie', { params: { query, page } }),

  // Search TV shows
  searchTVShows: (query, page = 1) =>
    tmdbApi.get('/search/tv', { params: { query, page } }),

  // Discover movies with filters
  discoverMovies: (params = {}) =>
    tmdbApi.get('/discover/movie', { params }),

  // Discover TV shows with filters
  discoverTVShows: (params = {}) =>
    tmdbApi.get('/discover/tv', { params }),

  // Get genres
  getMovieGenres: () =>
    tmdbApi.get('/genre/movie/list'),

  getTVGenres: () =>
    tmdbApi.get('/genre/tv/list'),

  // Get movies by genre
  getMoviesByGenre: (genreId, page = 1) =>
    tmdbApi.get('/discover/movie', { params: { with_genres: genreId, page } }),

  // Get TV shows by genre
  getTVShowsByGenre: (genreId, page = 1) =>
    tmdbApi.get('/discover/tv', { params: { with_genres: genreId, page } }),
};

// Helper function to format content for our app
export const formatContent = (item) => {
  const isMovie = item.media_type === 'movie' || item.title;
  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  
  return {
    id: item.id,
    title,
    image: getImageUrl(item.poster_path),
    backdrop: getBackdropUrl(item.backdrop_path),
    description: item.overview,
    year,
    rating: item.vote_average ? Math.round(item.vote_average * 10) : 85,
    genres: item.genre_ids || [],
    mediaType: isMovie ? 'movie' : 'tv',
    adult: item.adult || false,
    popularity: item.popularity || 0,
  };
};

export default tmdbService;