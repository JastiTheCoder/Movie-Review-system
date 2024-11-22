import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);

  // Fetch genres once when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/genre/movie/list',
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
              'Accept': 'application/json'
            }
          }
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Separate function to fetch movies
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let url;
      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenre}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?page=${page}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect for fetching movies
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedGenre, page]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setSelectedGenre('');
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setPage(1);
    setSearchQuery('');
  };

  // Movies Grid Component
  const MoviesGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <Link
          key={movie.id}
          to={`/movies/${movie.id}`}
          className="group"
        >
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-card shadow-md">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                No Image
              </div>
            )}
          </div>
          <h3 className="font-semibold truncate">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">
            {movie.release_date?.split('-')[0]}
          </p>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section - This stays static */}
      <div className="mb-8 space-y-6">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 w-full"
          />
        </div>

        <div className="bg-card rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Filter by Genre</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedGenre === '' ? 'default' : 'outline'}
              onClick={() => handleGenreSelect('')}
              className={`rounded-full ${
                selectedGenre === '' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10'
              }`}
            >
              All Movies
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre.id}
                size="sm"
                variant={selectedGenre === genre.id ? 'default' : 'outline'}
                onClick={() => handleGenreSelect(genre.id)}
                className={`rounded-full ${
                  selectedGenre === genre.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-primary/10'
                }`}
              >
                {genre.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedGenre || searchQuery) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Active filters:</span>
            {selectedGenre && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                {genres.find(g => g.id === selectedGenre)?.name || 'Genre'}
              </span>
            )}
            {searchQuery && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                Search: "{searchQuery}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Movies Section - This is the only part that reloads */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery 
            ? `Search Results for "${searchQuery}"`
            : selectedGenre 
              ? `${genres.find(g => g.id === selectedGenre)?.name} Movies`
              : 'Popular Movies'
          }
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted aspect-[2/3] rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <MoviesGrid />
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <Button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span className="flex items-center px-4 font-medium">
          Page {page}
        </span>
        <Button
          onClick={() => setPage(p => p + 1)}
          disabled={movies.length < 20}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
} 