import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Business {
  id: string;
  ownerName: string;
  businessName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  business: Business | null;
  loading: boolean;
  isAuthenticated: boolean;
  userType: 'user' | 'business' | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_USER'; payload: { user: User; token: string } }
  | { type: 'LOGIN_BUSINESS'; payload: { business: Business; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'UPDATE_BUSINESS'; payload: Business };

const initialState: AuthState = {
  user: null,
  business: null,
  loading: true,
  isAuthenticated: false,
  userType: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_USER':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userType', 'user');
      return {
        ...state,
        user: action.payload.user,
        business: null,
        isAuthenticated: true,
        userType: 'user',
        loading: false,
      };
    case 'LOGIN_BUSINESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userType', 'business');
      return {
        ...state,
        business: action.payload.business,
        user: null,
        isAuthenticated: true,
        userType: 'business',
        loading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      return {
        ...initialState,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE_BUSINESS':
      return {
        ...state,
        business: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  loginUser: (email: string, password: string) => Promise<void>;
  loginBusiness: (email: string, password: string) => Promise<void>;
  registerUser: (data: any) => Promise<void>;
  registerBusiness: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: User) => void;
  updateBusiness: (data: Business) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || !userType) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      if (userType === 'user') {
        const response = await authAPI.getCurrentUser();
        dispatch({ 
          type: 'LOGIN_USER', 
          payload: { user: response.data.user, token } 
        });
      } else if (userType === 'business') {
        const response = await authAPI.getCurrentBusiness();
        dispatch({ 
          type: 'LOGIN_BUSINESS', 
          payload: { business: response.data.business, token } 
        });
      }
    } catch (error) {
      logout();
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await authAPI.loginUser({ email, password });
      dispatch({ 
        type: 'LOGIN_USER', 
        payload: { 
          user: response.data.user, 
          token: response.data.token 
        } 
      });
    } catch (error) {
      throw error;
    }
  };

  const loginBusiness = async (email: string, password: string) => {
    try {
      const response = await authAPI.loginBusiness({ email, password });
      dispatch({ 
        type: 'LOGIN_BUSINESS', 
        payload: { 
          business: response.data.business, 
          token: response.data.token 
        } 
      });
    } catch (error) {
      throw error;
    }
  };

  const registerUser = async (data: any) => {
    try {
      const response = await authAPI.registerUser(data);
      dispatch({ 
        type: 'LOGIN_USER', 
        payload: { 
          user: response.data.user, 
          token: response.data.token 
        } 
      });
    } catch (error) {
      throw error;
    }
  };

  const registerBusiness = async (data: any) => {
    try {
      const response = await authAPI.registerBusiness(data);
      dispatch({ 
        type: 'LOGIN_BUSINESS', 
        payload: { 
          business: response.data.business, 
          token: response.data.token 
        } 
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (data: User) => {
    dispatch({ type: 'UPDATE_USER', payload: data });
  };

  const updateBusiness = (data: Business) => {
    dispatch({ type: 'UPDATE_BUSINESS', payload: data });
  };

  const value: AuthContextType = {
    ...state,
    loginUser,
    loginBusiness,
    registerUser,
    registerBusiness,
    logout,
    updateUser,
    updateBusiness,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};