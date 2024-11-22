import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function FavoriteButton({ movieId }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const checkFavorite = async () => {
    if (!user) return;
    
    try {
      const response = await api.get(`/favorites/${movieId}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      if (error.response?.status === 404) {
        setIsFavorite(false);
        return;
      }
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${movieId}`);
        toast.success('Removed from favorites');
      } else {
        await api.post('/favorites', { movieId });
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  useEffect(() => {
    checkFavorite();
  }, [movieId, user]);

  return (
    <button
      onClick={toggleFavorite}
      className="p-2 rounded-full hover:bg-primary/10"
    >
      <Star
        className={`w-6 h-6 ${
          isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
        }`}
      />
    </button>
  );
} 