import express from 'express';
import { auth } from '../middleware/auth.js';
import Favorite from '../models/Favorite.js';

const router = express.Router();

// Add to favorites
router.post('/', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const favorite = new Favorite({
      userId: req.user._id,
      movieId
    });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ addedAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:movieId', auth, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user._id,
      movieId: req.params.movieId
    });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if movie is favorited
router.get('/:movieId', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      movieId: req.params.movieId
    });
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 