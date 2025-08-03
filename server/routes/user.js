const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Review = require('../models/Review');

const router = express.Router();

// Get user profile
router.get('/profile', 
  passport.authenticate('user-jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id)
        .select('-password')
        .populate('reviews');

      res.json(user);
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update user profile
router.put('/profile',
  passport.authenticate('user-jwt', { session: false }),
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').optional().trim(),
    body('location.city').optional().trim(),
    body('location.state').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).select('-password');

      res.json(user);
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's reviews
router.get('/reviews',
  passport.authenticate('user-jwt', { session: false }),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const reviews = await Review.find({ user: req.user._id })
        .populate('business', 'businessInfo.name businessInfo.category location.city')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Review.countDocuments({ user: req.user._id });

      res.json({
        reviews,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;