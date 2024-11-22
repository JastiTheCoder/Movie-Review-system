import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import FavoritesList from '@/components/movies/FavoritesList';

export default function Profile() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieDetails, setMovieDetails] = useState({});

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await api.get('/reviews/user');
        setReviews(response.data);
        
        // Fetch movie details for each review
        const movieIds = [...new Set(response.data.map(review => review.movieId))];
        const movieData = {};
        
        await Promise.all(movieIds.map(async (movieId) => {
          const movieResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}`,
            {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                'Accept': 'application/json'
              }
            }
          );
          const data = await movieResponse.json();
          movieData[movieId] = data;
        }));
        
        setMovieDetails(movieData);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setError('Failed to load your reviews');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      // Update the local state to remove the deleted review
      setReviews(reviews.filter(review => review.id !== reviewId));
      // Dispatch event to update ReviewList components
      window.dispatchEvent(new Event('reviewsUpdated'));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Please log in to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card/50 p-6 rounded-lg">
              <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">You haven't written any reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card/50 p-6 rounded-lg">
                {movieDetails[review.movieId] && (
                  <Link 
                    to={`/movies/${review.movieId}`}
                    className="block mb-4 hover:opacity-80"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movieDetails[review.movieId].poster_path}`}
                        alt={movieDetails[review.movieId].title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {movieDetails[review.movieId].title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {movieDetails[review.movieId].release_date?.split('-')[0]}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
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
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteReview(review.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
                
                <p className="text-foreground/90">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>
        <FavoritesList />
      </div>
    </div>
  );
} 