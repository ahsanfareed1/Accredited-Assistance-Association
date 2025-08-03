const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const Business = require('../models/Business');
const Review = require('../models/Review');

const router = express.Router();

// Get all businesses with pagination and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter['businessInfo.category'] = req.query.category;
    }
    
    if (req.query.city) {
      filter['location.city'] = req.query.city;
    }

    const businesses = await Business.find(filter)
      .select('-owner.password')
      .populate('reviews', 'rating')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Business.countDocuments(filter);

    res.json({
      businesses,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single business by ID
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
      .select('-owner.password')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar'
        },
        options: { sort: { createdAt: -1 } }
      });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update business profile (business owner only)
router.put('/profile', 
  passport.authenticate('business-jwt', { session: false }),
  [
    body('businessInfo.name').optional().trim().isLength({ min: 2 }),
    body('businessInfo.description').optional().trim(),
    body('location.address').optional().notEmpty(),
    body('contact.phone').optional().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const business = await Business.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).select('-owner.password');

      res.json(business);
    } catch (error) {
      console.error('Update business error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update business hours
router.put('/hours',
  passport.authenticate('business-jwt', { session: false }),
  async (req, res) => {
    try {
      const business = await Business.findByIdAndUpdate(
        req.user._id,
        { $set: { hours: req.body.hours } },
        { new: true }
      ).select('-owner.password');

      res.json(business);
    } catch (error) {
      console.error('Update hours error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get featured businesses
router.get('/featured/list', async (req, res) => {
  try {
    const businesses = await Business.find({
      isActive: true,
      isVerified: true,
      'rating.average': { $gte: 4 }
    })
      .select('-owner.password')
      .sort({ 'rating.average': -1 })
      .limit(8);

    res.json(businesses);
  } catch (error) {
    console.error('Get featured businesses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get businesses by category
router.get('/category/:category', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const businesses = await Business.find({
      'businessInfo.category': req.params.category,
      isActive: true
    })
      .select('-owner.password')
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(limit);

    const total = await Business.countDocuments({
      'businessInfo.category': req.params.category,
      isActive: true
    });

    res.json({
      businesses,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get businesses by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;