import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Clock, Calendar, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import toast from 'react-hot-toast';
import FavoriteButton from '@/components/movies/FavoriteButton';

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,videos`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    // Force ReviewList to refresh
    const reviewListElement = document.getElementById('review-list');
    if (reviewListElement) {
      reviewListElement.dispatchEvent(new Event('refresh'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto flex flex-col md:flex-row gap-8">
            <div className="shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-48 rounded-lg shadow-2xl"
              />
              <div className="absolute top-2 right-2">
                <FavoriteButton movieId={movie.id} />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock />
                  {movie.runtime} min
                </span>
                <span className="flex items-center gap-1">
                  <Calendar />
                  {movie.release_date}
                </span>
                <span className="flex items-center gap-1">
                  <Users />
                  {movie.vote_count} votes
                </span>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {movie.overview}
              </p>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <section className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">Cast</h2>
        {movie.credits && movie.credits.cast && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movie.credits.cast.slice(0, 6).map((actor) => (
              <div key={actor.id} className="group relative">
                <img
                  src={actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+Image'
                  }
                  alt={actor.name}
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="text-center p-2">
                    <p className="font-bold">{actor.name}</p>
                    <p className="text-sm text-gray-300">{actor.character}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {user && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)}>
              <MessageCircle className="mr-2" />
              Write a Review
            </Button>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              movieId={id}
              onClose={() => setShowReviewForm(false)}
              onSuccess={() => {
                setShowReviewForm(false);
                toast.success('Review submitted successfully!');
              }}
            />
          </div>
        )}

        <ReviewList movieId={id} />
      </section>

      {/* Similar Movies */}
      <section className="container mx-auto">
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        {/* Add similar movies component here */}
      </section>
    </div>
  );
} 