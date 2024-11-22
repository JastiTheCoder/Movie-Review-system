import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link 
      to={`/movies/${movie.id}`}
      className="group relative overflow-hidden rounded-lg bg-card transition-all hover:scale-105"
    >
      <div className="aspect-[2/3] w-full">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-full flex-col justify-end p-4">
            <h3 className="text-lg font-bold text-white">{movie.title}</h3>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {movie.release_date.split('-')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 