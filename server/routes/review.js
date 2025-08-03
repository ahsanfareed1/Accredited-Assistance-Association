const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Business = require('../models/Business');
const User = require('../models/User');

const router = express.Router();

// Create a review
router.post('/', 
  passport.authenticate('user-jwt', { session: false }),
  [
    body('business').isMongoId().withMessage('Valid business ID required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
    body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { business, rating, title, comment } = req.body;

      // Check if business exists
      const businessExists = await Business.findById(business);
      if (!businessExists) {
        return res.status(404).json({ message: 'Business not found' });
      }

      // Check if user already reviewed this business
      const existingReview = await Review.findOne({
        user: req.user._id,
        business
      });

      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this business' });
      }

      // Create review
      const review = new Review({
        user: req.user._id,
        business,
        rating,
        title,
        comment
      });

      await review.save();

      // Update business rating
      await updateBusinessRating(business);

      // Populate review with user data
      await review.populate('user', 'name avatar');

      res.status(201).json(review);
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get reviews for a business
router.get('/business/:businessId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ 
      business: req.params.businessId,
      isApproved: true 
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ 
      business: req.params.businessId,
      isApproved: true 
    });

    res.json({
      reviews,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review
router.put('/:id',
  passport.authenticate('user-jwt', { session: false }),
  [
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ min: 5, max: 100 }),
    body('comment').optional().trim().isLength({ min: 10, max: 1000 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const review = await Review.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      Object.assign(review, req.body);
      await review.save();

      // Update business rating if rating changed
      if (req.body.rating) {
        await updateBusinessRating(review.business);
      }

      await review.populate('user', 'name avatar');
      res.json(review);
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a review
router.delete('/:id',
  passport.authenticate('user-jwt', { session: false }),
  async (req, res) => {
    try {
      const review = await Review.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      const businessId = review.business;
      await Review.findByIdAndDelete(req.params.id);

      // Update business rating
      await updateBusinessRating(businessId);

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Mark review as helpful
router.post('/:id/helpful',
  passport.authenticate('user-jwt', { session: false }),
  async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      const alreadyMarked = review.helpful.some(
        help => help.user.toString() === req.user._id.toString()
      );

      if (alreadyMarked) {
        // Remove helpful mark
        review.helpful = review.helpful.filter(
          help => help.user.toString() !== req.user._id.toString()
        );
      } else {
        // Add helpful mark
        review.helpful.push({ user: req.user._id });
      }

      await review.save();
      res.json({ helpful: review.helpful.length });
    } catch (error) {
      console.error('Mark helpful error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Helper function to update business rating
async function updateBusinessRating(businessId) {
  const reviews = await Review.find({ business: businessId, isApproved: true });
  
  if (reviews.length === 0) {
    await Business.findByIdAndUpdate(businessId, {
      'rating.average': 0,
      'rating.count': 0
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Business.findByIdAndUpdate(businessId, {
    'rating.average': Math.round(averageRating * 10) / 10,
    'rating.count': reviews.length
  });
}

module.exports = router;