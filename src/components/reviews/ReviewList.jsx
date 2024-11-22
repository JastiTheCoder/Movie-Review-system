import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReviewList({ movieId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/movie/${movieId}`);
      console.log('Fetched reviews:', response.data);
      setReviews(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchReviews();
    }
  }, [movieId]);

  // Add event listener for review updates
  useEffect(() => {
    const handleReviewUpdate = () => {
      fetchReviews();
    };

    window.addEventListener('reviewsUpdated', handleReviewUpdate);
    return () => {
      window.removeEventListener('reviewsUpdated', handleReviewUpdate);
    };
  }, [movieId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-card/50 p-6 rounded-lg">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
      ))}
    </div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-muted-foreground">No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-card/50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {review.userEmail?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium">{review.userEmail}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-foreground/90">{review.content}</p>
        </div>
      ))}
    </div>
  );
} 