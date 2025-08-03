import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Phone } from 'lucide-react';
import './BusinessCard.css';

interface BusinessCardProps {
  business: {
    _id: string;
    businessInfo: {
      name: string;
      category: string;
      description: string;
      logo?: { url: string };
    };
    location: {
      city: string;
      address: string;
    };
    contact: {
      phone: string;
    };
    rating: {
      average: number;
      count: number;
    };
  };
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const { businessInfo, location, contact, rating } = business;

  return (
    <div className="business-card">
      <Link to={`/business/${business._id}`} className="business-card-link">
        <div className="business-card-header">
          {businessInfo.logo?.url ? (
            <img src={businessInfo.logo.url} alt={businessInfo.name} className="business-logo" />
          ) : (
            <div className="business-logo-placeholder">
              {businessInfo.name.charAt(0)}
            </div>
          )}
          <div className="business-rating">
            <Star className="star-icon" />
            <span>{rating.average.toFixed(1)}</span>
            <span className="review-count">({rating.count})</span>
          </div>
        </div>

        <div className="business-card-content">
          <h3 className="business-name">{businessInfo.name}</h3>
          <p className="business-category">{businessInfo.category}</p>
          <p className="business-description">
            {businessInfo.description.length > 100
              ? `${businessInfo.description.substring(0, 100)}...`
              : businessInfo.description}
          </p>

          <div className="business-details">
            <div className="business-location">
              <MapPin size={16} />
              <span>{location.city}</span>
            </div>
            <div className="business-phone">
              <Phone size={16} />
              <span>{contact.phone}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BusinessCard;