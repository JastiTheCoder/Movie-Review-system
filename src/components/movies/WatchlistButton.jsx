import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function WatchlistButton({ movieId }) {
  const { user } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/watchlist/${movieId}`);
        setIsInWatchlist(response.data.isInWatchlist);
      } catch (error) {
        console.error('Error checking watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWatchlist();
  }, [movieId, user]);

  const toggleWatchlist = async () => {
    if (!user) {
      toast.error('Please login to add to watchlist');
      return;
    }

    try {
      if (isInWatchlist) {
        await api.delete(`/watchlist/${movieId}`);
        toast.success('Removed from watchlist');
      } else {
        await api.post('/watchlist', { movieId });
        toast.success('Added to watchlist');
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  if (loading) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleWatchlist}
      className="flex items-center gap-2"
    >
      {isInWatchlist ? (
        <>
          <BookmarkCheck className="w-4 h-4" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark className="w-4 h-4" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
} 