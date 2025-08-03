const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Business = require('../models/Business');

const router = express.Router();

// Generate JWT token
const generateToken = (id, type = 'user') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// User Registration
router.post('/user/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    const token = generateToken(user._id, 'user');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login
router.post('/user/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, 'user');

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Business Registration
router.post('/business/register', [
  body('owner.name').trim().isLength({ min: 2 }).withMessage('Owner name must be at least 2 characters'),
  body('owner.email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('owner.password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('businessInfo.name').trim().isLength({ min: 2 }).withMessage('Business name must be at least 2 characters'),
  body('businessInfo.category').notEmpty().withMessage('Business category is required'),
  body('location.address').notEmpty().withMessage('Business address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const businessData = req.body;

    // Check if business email already exists
    const existingBusiness = await Business.findOne({ 'owner.email': businessData.owner.email });
    if (existingBusiness) {
      return res.status(400).json({ message: 'Business already exists with this email' });
    }

    const business = new Business(businessData);
    await business.save();

    const token = generateToken(business._id, 'business');

    res.status(201).json({
      success: true,
      token,
      business: {
        id: business._id,
        ownerName: business.owner.name,
        businessName: business.businessInfo.name,
        email: business.owner.email
      }
    });
  } catch (error) {
    console.error('Business registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Business Login
router.post('/business/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const business = await Business.findOne({ 'owner.email': email });
    if (!business) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await business.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(business._id, 'business');

    res.json({
      success: true,
      token,
      business: {
        id: business._id,
        ownerName: business.owner.name,
        businessName: business.businessInfo.name,
        email: business.owner.email
      }
    });
  } catch (error) {
    console.error('Business login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id, 'user');
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

// Get current user
router.get('/user/me', passport.authenticate('user-jwt', { session: false }), (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      phone: req.user.phone,
      location: req.user.location
    }
  });
});

// Get current business
router.get('/business/me', passport.authenticate('business-jwt', { session: false }), (req, res) => {
  res.json({
    business: {
      id: req.user._id,
      owner: req.user.owner,
      businessInfo: req.user.businessInfo,
      location: req.user.location,
      contact: req.user.contact,
      hours: req.user.hours,
      rating: req.user.rating,
      isVerified: req.user.isVerified,
      features: req.user.features,
      socialMedia: req.user.socialMedia
    }
  });
});

module.exports = router;