import express from 'express';
import { auth } from '../middleware/auth.js';
import Watchlist from '../models/Watchlist.js';

const router = express.Router();

// Add movie to watchlist
router.post('/', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const watchlistItem = new Watchlist({
      userId: req.user._id,
      movieId
    });
    await watchlistItem.save();
    res.status(201).json(watchlistItem);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get user's watchlist
router.get('/', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user._id })
      .sort({ addedAt: -1 });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from watchlist
router.delete('/:movieId', auth, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({
      userId: req.user._id,
      movieId: req.params.movieId
    });
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if movie is in watchlist
router.get('/:movieId', auth, async (req, res) => {
  try {
    const item = await Watchlist.findOne({
      userId: req.user._id,
      movieId: req.params.movieId
    });
    res.json({ isInWatchlist: !!item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 