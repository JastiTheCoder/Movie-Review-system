import { useEffect, useState } from 'react';
import MovieCard from '@/components/movies/MovieCard';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Github, Mail, Twitter } from 'lucide-react';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week`,
            {
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                'Accept': 'application/json'
              }
            }
          );
        
        if (!response.ok) {
          throw new Error('Failed to fetch trending movies');
        }
        
        const data = await response.json();
        setTrendingMovies(data.results);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        toast.error('Failed to load trending movies');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-card rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Trending Movies</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {trendingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <footer className="bg-background border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About MovieHub</h3>
              <p className="text-sm text-muted-foreground">
                Your ultimate destination for movie information, reviews, and recommendations. 
                Discover the magic of cinema with us.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/movies" className="hover:text-primary">Movies</Link>
                </li>
                <li>
                  <Link to="/compare" className="hover:text-primary">Compare Movies</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-primary">About Us</Link>
                </li>
                <li>
                  <Link to="/popular" className="hover:text-primary">Popular</Link>
                </li>
                <li>
                  <Link to="/top-rated" className="hover:text-primary">Top Rated</Link>
                </li>
                <li>
                  <Link to="/upcoming" className="hover:text-primary">Upcoming</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="https://www.themoviedb.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    TMDB API
                  </a>
                </li>
                <li>
                  <a 
                    href="https://developer.themoviedb.org/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    API Documentation
                  </a>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-primary">FAQ</Link>
                </li>
                <li>
                  <Link to="/support" className="hover:text-primary">Support</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:contact@moviehub.com"
                  className="hover:text-primary"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Stay updated with our newsletter:</p>
                <div className="flex mt-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-3 py-1 border rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button className="bg-primary text-primary-foreground px-4 py-1 rounded-r-md hover:bg-primary/90">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              Data provided by{' '}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                The Movie Database (TMDB)
              </a>
            </p>
            <p className="mt-2">
              © {currentYear} MovieHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 