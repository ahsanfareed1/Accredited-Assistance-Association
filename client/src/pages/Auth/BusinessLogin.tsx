import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

type FormData = { email: string; password: string; };

const BusinessLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { loginBusiness } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await loginBusiness(data.email, data.password);
      toast.success('Login successful!');
      navigate('/business/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Business Login</h2>
          <p>Access your business dashboard</p>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input {...register('email')} type="email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input {...register('password')} type="password" required />
            </div>
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-links">
            <p>Don't have a business account? <Link to="/business/register">Register</Link></p>
            <p>Customer? <Link to="/login">Customer Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLogin;