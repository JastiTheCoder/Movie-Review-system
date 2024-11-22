import { MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function ReviewCard({ review }) {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card/50 p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
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
              className={`w-4 h-4 ${
                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-foreground/80">{review.content}</p>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <ThumbsUp className="w-4 h-4 mr-2" />
          Helpful
        </Button>
        {user && user.uid !== review.userId && (
          <Button variant="ghost" size="sm">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        )}
      </div>
    </div>
  );
} 