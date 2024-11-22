import { useState } from 'react';
import axios from 'axios';
import { Star, Clock, TrendingUp, Calendar } from 'lucide-react';

export default function CompareMovies() {
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [searchResults1, setSearchResults1] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [selectedMovie1, setSelectedMovie1] = useState(null);
  const [selectedMovie2, setSelectedMovie2] = useState(null);

  const searchMovies = async (searchTerm, setResults) => {
    if (searchTerm.length < 2) return;

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2Y3NTY5NzI3NTc2ZjFiOGYxMzQzODM0NjE2YiIsInN1YiI6IjY1ZjJkZGZmMzA0NzA1MDE3YWYyNTI4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X_a6SRqBXsqkYvxAPaKMeOQZkBXlKkKBtCPr2DaKBB4'
          },
          params: {
            query: searchTerm,
            language: 'en-US',
            page: 1
          }
        }
      );
      setResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const handleMovieSelect = async (movie, setSelectedMovie, setSearchTerm, setResults) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTljY2Y3NTY5NzI3NTc2ZjFiOGYxMzQzODM0NjE2YiIsInN1YiI6IjY1ZjJkZGZmMzA0NzA1MDE3YWYyNTI4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X_a6SRqBXsqkYvxAPaKMeOQZkBXlKkKBtCPr2DaKBB4'
          }
        }
      );
      setSelectedMovie(response.data);
      setSearchTerm('');
      setResults([]);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Compare Movies</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* First Movie Search */}
        <div>
          <input
            type="text"
            value={searchTerm1}
            onChange={(e) => {
              setSearchTerm1(e.target.value);
              searchMovies(e.target.value, setSearchResults1);
            }}
            placeholder="Search for first movie..."
            className="w-full p-2 border rounded-md mb-2"
          />
          {searchResults1.length > 0 && !selectedMovie1 && (
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {searchResults1.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieSelect(movie, setSelectedMovie1, setSearchTerm1, setSearchResults1)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {movie.title} ({movie.release_date?.split('-')[0]})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Second Movie Search */}
        <div>
          <input
            type="text"
            value={searchTerm2}
            onChange={(e) => {
              setSearchTerm2(e.target.value);
              searchMovies(e.target.value, setSearchResults2);
            }}
            placeholder="Search for second movie..."
            className="w-full p-2 border rounded-md mb-2"
          />
          {searchResults2.length > 0 && !selectedMovie2 && (
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {searchResults2.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieSelect(movie, setSelectedMovie2, setSearchTerm2, setSearchResults2)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {movie.title} ({movie.release_date?.split('-')[0]})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Section */}
      {selectedMovie1 && selectedMovie2 && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Movie 1 Details */}
            <div className="text-center">
              <img
                src={`https://image.tmdb.org/t/p/w300${selectedMovie1.poster_path}`}
                alt={selectedMovie1.title}
                className="mx-auto rounded-lg shadow-md"
              />
              <h2 className="text-xl font-bold mt-4">{selectedMovie1.title}</h2>
            </div>

            {/* Movie 2 Details */}
            <div className="text-center">
              <img
                src={`https://image.tmdb.org/t/p/w300${selectedMovie2.poster_path}`}
                alt={selectedMovie2.title}
                className="mx-auto rounded-lg shadow-md"
              />
              <h2 className="text-xl font-bold mt-4">{selectedMovie2.title}</h2>
            </div>
          </div>

          {/* Comparison Metrics */}
          <div className="space-y-4">
            {/* Rating Comparison */}
            <div className="grid grid-cols-3 items-center">
              <div className={`text-right ${selectedMovie1.vote_average > selectedMovie2.vote_average ? 'text-green-600 font-bold' : ''}`}>
                {selectedMovie1.vote_average.toFixed(1)}
              </div>
              <div className="text-center flex items-center justify-center gap-2">
                <Star className="w-4 h-4" /> Rating
              </div>
              <div className={`text-left ${selectedMovie2.vote_average > selectedMovie1.vote_average ? 'text-green-600 font-bold' : ''}`}>
                {selectedMovie2.vote_average.toFixed(1)}
              </div>
            </div>

            {/* Runtime Comparison */}
            <div className="grid grid-cols-3 items-center">
              <div className={`text-right ${selectedMovie1.runtime > selectedMovie2.runtime ? 'text-green-600 font-bold' : ''}`}>
                {selectedMovie1.runtime} min
              </div>
              <div className="text-center flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> Runtime
              </div>
              <div className={`text-left ${selectedMovie2.runtime > selectedMovie1.runtime ? 'text-green-600 font-bold' : ''}`}>
                {selectedMovie2.runtime} min
              </div>
            </div>

            {/* Popularity Comparison */}
            <div className="grid grid-cols-3 items-center">
              <div className={`text-right ${selectedMovie1.popularity > selectedMovie2.popularity ? 'text-green-600 font-bold' : ''}`}>
                {selectedMovie1.popularity.toFixed(1)}
              </div>
              <div className="text-center flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" /> Popularity
              </div>
              <div className={`text-left ${selectedMovie2.popularity > selectedMovie1.popularity ? 'text-green-600 font-bold' : ''}`}>
                {selectedMovie2.popularity.toFixed(1)}
              </div>
            </div>

            {/* Release Date */}
            <div className="grid grid-cols-3 items-center">
              <div className="text-right">
                {selectedMovie1.release_date}
              </div>
              <div className="text-center flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" /> Release Date
              </div>
              <div className="text-left">
                {selectedMovie2.release_date}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 