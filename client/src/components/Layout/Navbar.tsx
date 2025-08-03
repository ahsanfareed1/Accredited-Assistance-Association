import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Building, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, userType, user, business, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const currentUser = userType === 'user' ? user : business;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span>AAA</span>
          <small>Accredited Assistant Association</small>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <Link to="/search" className="navbar-link">
            <Search size={18} />
            Find Businesses
          </Link>
          
          {!isAuthenticated ? (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
              <Link to="/business/login" className="navbar-link">Business Login</Link>
            </div>
          ) : (
            <div className="navbar-user" onMouseLeave={() => setIsDropdownOpen(false)}>
              <button 
                className="user-avatar"
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                {userType === 'user' ? (
                  <>
                    <User size={20} />
                    <span>{user?.name}</span>
                  </>
                ) : (
                  <>
                    <Building size={20} />
                    <span>{business?.businessName}</span>
                  </>
                )}
              </button>
              
              {isDropdownOpen && (
                <div className="user-dropdown">
                  {userType === 'user' ? (
                    <Link to="/profile" className="dropdown-item">
                      <User size={16} />
                      My Profile
                    </Link>
                  ) : (
                    <>
                      <Link to="/business/dashboard" className="dropdown-item">
                        <Building size={16} />
                        Dashboard
                      </Link>
                      <Link to="/business/profile" className="dropdown-item">
                        <User size={16} />
                        Business Profile
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/search" className="mobile-link" onClick={toggleMenu}>
              <Search size={18} />
              Find Businesses
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="mobile-link" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/register" className="mobile-link" onClick={toggleMenu}>
                  Sign Up
                </Link>
                <Link to="/business/login" className="mobile-link" onClick={toggleMenu}>
                  Business Login
                </Link>
              </>
            ) : (
              <>
                {userType === 'user' ? (
                  <Link to="/profile" className="mobile-link" onClick={toggleMenu}>
                    <User size={18} />
                    My Profile
                  </Link>
                ) : (
                  <>
                    <Link to="/business/dashboard" className="mobile-link" onClick={toggleMenu}>
                      <Building size={18} />
                      Dashboard
                    </Link>
                    <Link to="/business/profile" className="mobile-link" onClick={toggleMenu}>
                      <User size={18} />
                      Business Profile
                    </Link>
                  </>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }} 
                  className="mobile-link logout"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;