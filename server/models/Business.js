const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const businessSchema = new mongoose.Schema({
  owner: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  businessInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Restaurant', 'Shopping', 'Health & Medical', 'Automotive', 
        'Home Services', 'Beauty & Spa', 'Education', 'Professional Services',
        'Real Estate', 'Entertainment', 'Hotels & Travel', 'Technology',
        'Manufacturing', 'Construction', 'Agriculture', 'Other'
      ]
    },
    subcategory: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    images: [{
      url: String,
      public_id: String
    }],
    logo: {
      url: String,
      public_id: String
    }
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true,
      enum: [
        'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
        'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
        'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
        'Mardan', 'Kasur', 'Rahim Yar Khan', 'Sahiwal', 'Okara', 'Other'
      ]
    },
    state: {
      type: String,
      required: true,
      enum: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory']
    },
    zipCode: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    whatsapp: String,
    email: String
  },
  hours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [String], // e.g., 'WiFi', 'Parking', 'Delivery', 'Takeout'
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  }
}, {
  timestamps: true
});

// Hash password before saving
businessSchema.pre('save', async function(next) {
  if (!this.isModified('owner.password')) return next();
  this.owner.password = await bcrypt.hash(this.owner.password, 10);
  next();
});

// Compare password method
businessSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.owner.password);
};

// Index for location-based searches
businessSchema.index({ 'location.coordinates': '2dsphere' });
businessSchema.index({ 'businessInfo.category': 1, 'location.city': 1 });
businessSchema.index({ 'businessInfo.name': 'text', 'businessInfo.description': 'text' });

module.exports = mongoose.model('Business', businessSchema);