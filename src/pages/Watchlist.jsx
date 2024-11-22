import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import MovieCard from '@/components/movies/MovieCard';
import toast from 'react-hot-toast';

export default function Watchlist() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const watchlistResponse = await api.get('/watchlist');
        
        // Fetch movie details for each watchlist item
        const movieDetails = await Promise.all(
          watchlistResponse.data.map(async (item) => {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${item.movieId}`,
              {
                headers: {
                  'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                  'Accept': 'application/json'
                }
              }
            );
            return response.json();
          })
        );
        
        setMovies(movieDetails);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        toast.error('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Please log in to view your watchlist.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-card rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Watchlist</h1>
      {movies.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Your watchlist is empty. Add movies to watch later!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
} 