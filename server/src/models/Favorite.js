import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema); 