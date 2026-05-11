import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/me');
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/register', { name, email, password });
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await axios.get('/logout');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (err) {
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put('/me/update', userData);
      if (response.data.success) {
        setUser(response.data.user);
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  };

  // Update password function
  const updatePassword = async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put('/password/update', { 
        oldPassword, 
        newPassword, 
        confirmPassword 
      });
      if (response.data.success) {
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Password update failed' };
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/password/forgot', { email });
      if (response.data.success) {
        setLoading(false);
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Request failed' };
    }
  };

  // Reset password function
  const resetPassword = async (token, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`/password/reset/${token}`, { 
        password, 
        confirmPassword 
      });
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: response.data.user };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Reset failed' };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      updatePassword,
      forgotPassword,
      resetPassword,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
