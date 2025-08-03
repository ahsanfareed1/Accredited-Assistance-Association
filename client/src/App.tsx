import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import BusinessLogin from './pages/Auth/BusinessLogin';
import BusinessRegister from './pages/Auth/BusinessRegister';
import BusinessProfile from './pages/Business/BusinessProfile';
import BusinessDashboard from './pages/Business/BusinessDashboard';
import BusinessDetail from './pages/Business/BusinessDetail';
import Search from './pages/Search';
import UserProfile from './pages/User/UserProfile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/business/:id" element={<BusinessDetail />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/business/login" element={<BusinessLogin />} />
                <Route path="/business/register" element={<BusinessRegister />} />
                
                {/* Protected User Routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute type="user">
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Business Routes */}
                <Route 
                  path="/business/dashboard" 
                  element={
                    <ProtectedRoute type="business">
                      <BusinessDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/business/profile" 
                  element={
                    <ProtectedRoute type="business">
                      <BusinessProfile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
