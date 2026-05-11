import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch cart on initial load and when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      setCart(null);
      setCartItems([]);
      setItemCount(0);
      setSubtotal(0);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch cart from API
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/cart');
      if (response.data.success) {
        const cartData = response.data.cart;
        setCart(cartData);
        setCartItems(cartData.cartItems || []);
        
        // Calculate totals
        const count = cartData.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
        const total = cartData.cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
        
        setItemCount(count);
        setSubtotal(total);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/cart/add', { productId, quantity });
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put('/cart/update', { itemId, quantity });
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to update cart' };
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put('/cart/remove', { itemId });
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to remove from cart' };
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.delete('/cart/clear');
      if (response.data.success) {
        setCart(null);
        setCartItems([]);
        setItemCount(0);
        setSubtotal(0);
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to clear cart' };
    }
  };

  // Get cart item count
  const getItemCount = async () => {
    try {
      const response = await axios.get('/cart/count');
      if (response.data.success) {
        setItemCount(response.data.count);
      }
    } catch (err) {
      console.error('Failed to get cart count:', err);
    }
  };

  // Merge guest cart with user cart (for login)
  const mergeCart = async (guestCartItems) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/cart/merge', { guestCartItems });
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to merge cart');
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Failed to merge cart' };
    }
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.product?._id === productId || item.product === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.product?._id === productId || item.product === productId);
    return item ? item.quantity : 0;
  };

  // Calculate shipping cost
  const calculateShipping = () => {
    return subtotal > 100 ? 0 : 10;
  };

  // Calculate tax
  const calculateTax = () => {
    return subtotal * 0.10; // 10% tax
  };

  // Calculate total
  const calculateTotal = () => {
    return subtotal + calculateShipping() + calculateTax();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      itemCount,
      subtotal,
      loading,
      error,
      fetchCart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      getItemCount,
      mergeCart,
      isInCart,
      getItemQuantity,
      calculateShipping,
      calculateTax,
      calculateTotal,
      clearError
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
