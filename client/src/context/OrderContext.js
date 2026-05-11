import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch user orders
  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/orders/me');
      if (response.data.success) {
        setOrders(response.data.orders);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  // Fetch single order
  const fetchOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/order/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.order);
        setLoading(false);
        return response.data.order;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
      setLoading(false);
      return null;
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/order/new', orderData);
      if (response.data.success) {
        setOrder(response.data.order);
        setLoading(false);
        return { success: true, order: response.data.order };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to create order' };
    }
  };

  // Create Stripe checkout session
  const createCheckoutSession = async (cartItems, shippingInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/checkout/create-session', { 
        cartItems, 
        shippingInfo 
      });
      if (response.data.success) {
        setLoading(false);
        return { success: true, url: response.data.url };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create checkout session');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to create checkout session' };
    }
  };

  // Get order by session ID
  const getOrderBySession = async (sessionId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/order/session/${sessionId}`);
      if (response.data.success) {
        setOrder(response.data.order);
        setLoading(false);
        return response.data.order;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get order by session');
      setLoading(false);
      return null;
    }
  };

  // Fetch orders on auth state change
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    } else {
      setOrders([]);
      setOrder(null);
    }
  }, [isAuthenticated, user]);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      order,
      loading,
      error,
      fetchOrders,
      fetchOrder,
      createOrder,
      createCheckoutSession,
      getOrderBySession,
      clearError
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
