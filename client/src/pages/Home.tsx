import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { businessAPI } from '../services/api';
import BusinessCard from '../components/Business/BusinessCard';
import './Home.css';

const CATEGORIES = [
  'Restaurant', 'Shopping', 'Health & Medical', 'Automotive',
  'Home Services', 'Beauty & Spa', 'Education', 'Professional Services'
];

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta'
];

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  const { data: featuredBusinesses } = useQuery({
    queryKey: ['featuredBusinesses'],
    queryFn: () => businessAPI.getFeaturedBusinesses(),
    select: (response) => response.data
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedCity) params.append('city', selectedCity);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find the Best Businesses in Pakistan</h1>
          <p>Discover top-rated businesses, read reviews, and connect with local services across Pakistan</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <div className="search-input-group">
                <Search className="input-icon" />
                <input
                  type="text"
                  placeholder="Search for businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="search-select"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="search-input-group">
                <MapPin className="input-icon" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="search-select"
                >
                  <option value="">All Cities</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button type="submit" className="search-btn">
              <Search size={20} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <Users />
              </div>
              <div className="stat-content">
                <h3>10,000+</h3>
                <p>Registered Businesses</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Star />
              </div>
              <div className="stat-content">
                <h3>50,000+</h3>
                <p>Customer Reviews</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <MapPin />
              </div>
              <div className="stat-content">
                <h3>100+</h3>
                <p>Cities Covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      {featuredBusinesses && featuredBusinesses.length > 0 && (
        <section className="featured-businesses">
          <div className="container">
            <h2>Featured Businesses</h2>
            <p>Top-rated businesses recommended by our community</p>
            
            <div className="businesses-grid">
              {featuredBusinesses.map((business: any) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map(category => (
              <div
                key={category}
                className="category-card"
                onClick={() => navigate(`/search?category=${category}`)}
              >
                <h3>{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Are you a business owner?</h2>
            <p>Join thousands of businesses on AAA and reach more customers</p>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/business/register')}
            >
              Add Your Business
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;