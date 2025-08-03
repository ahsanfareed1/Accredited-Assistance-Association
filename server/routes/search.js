const express = require('express');
const Business = require('../models/Business');

const router = express.Router();

// Search businesses
router.get('/', async (req, res) => {
  try {
    const { query, category, city, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let searchFilter = { isActive: true };

    // Text search
    if (query) {
      searchFilter.$or = [
        { 'businessInfo.name': { $regex: query, $options: 'i' } },
        { 'businessInfo.description': { $regex: query, $options: 'i' } },
        { 'businessInfo.subcategory': { $regex: query, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      searchFilter['businessInfo.category'] = category;
    }

    // Location filter
    if (city && city !== 'all') {
      searchFilter['location.city'] = city;
    }

    const businesses = await Business.find(searchFilter)
      .select('-owner.password')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Business.countDocuments(searchFilter);

    res.json({
      businesses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      },
      filters: {
        query,
        category,
        city
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    const businesses = await Business.find({
      isActive: true,
      $or: [
        { 'businessInfo.name': { $regex: query, $options: 'i' } },
        { 'businessInfo.category': { $regex: query, $options: 'i' } }
      ]
    })
      .select('businessInfo.name businessInfo.category location.city')
      .limit(10);

    const suggestions = businesses.map(business => ({
      name: business.businessInfo.name,
      category: business.businessInfo.category,
      city: business.location.city,
      id: business._id
    }));

    res.json({ suggestions });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;