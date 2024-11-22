import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import MovieCard from './MovieCard';

export default function FavoritesList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      const movieDetails = await Promise.all(
        response.data.map(async (fav) => {
          const movieResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${fav.movieId}`,
            {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                'Accept': 'application/json'
              }
            }
          );
          return movieResponse.json();
        })
      );
      setFavorites(movieDetails);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('favoritesUpdated', fetchFavorites);
    return () => window.removeEventListener('favoritesUpdated', fetchFavorites);
  }, []);

  if (loading) {
    return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-card rounded-lg"></div>
        </div>
      ))}
    </div>;
  }

  if (favorites.length === 0) {
    return <p className="text-muted-foreground">No favorite movies yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {favorites.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
} 