import express from 'express';
import { auth } from '../middleware/auth.js';
import Review from '../models/Review.js';

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', ['email', '_id'])
      .sort({ createdAt: -1 });

    if (!reviews) {
      return res.json([]);
    }

    const formattedReviews = reviews.map(review => ({
      id: review._id,
      content: review.content,
      rating: review.rating,
      createdAt: review.createdAt,
      userId: review.userId?._id || null,
      userEmail: review.userId?.email || 'Anonymous',
      helpful: review.helpful || []
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reviews',
      error: error.message 
    });
  }
});

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, rating, content } = req.body;
    
    console.log('Received review data:', {
      movieId,
      rating,
      content,
      userId: req.user._id,
      userEmail: req.user.email
    });
    
    if (!movieId || !rating || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const review = new Review({
      movieId,
      rating,
      content,
      userId: req.user._id
    });

    await review.save();
    console.log('Saved review to database:', review);
    
    const populatedReview = await Review.findById(review._id)
      .populate('userId', ['email', '_id']);
    
    console.log('Populated review being sent back:', populatedReview);
      
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.helpful.includes(req.user._id)) {
      review.helpful = review.helpful.filter(id => !id.equals(req.user._id));
    } else {
      review.helpful.push(req.user._id);
    }
    
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get reviews by current user
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map(review => ({
      id: review._id,
      content: review.content,
      rating: review.rating,
      createdAt: review.createdAt,
      movieId: review.movieId,
      helpful: review.helpful || []
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reviews',
      error: error.message 
    });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    await Review.deleteOne({ _id: req.params.id });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

export default router; 