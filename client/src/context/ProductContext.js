import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch all products
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.category) queryParams.append('category', params.category);
      if (params.price) queryParams.append('price', params.price);
      if (params.rating) queryParams.append('rating', params.rating);
      if (params.page) queryParams.append('page', params.page);
      
      const response = await axios.get(`/products?${queryParams.toString()}`);
      if (response.data.success) {
        setProducts(response.data.products);
        setLoading(false);
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('/products/featured');
      if (response.data.success) {
        setFeaturedProducts(response.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch featured products:', err);
    }
  };

  // Fetch new arrivals
  const fetchNewArrivals = async () => {
    try {
      const response = await axios.get('/products/new');
      if (response.data.success) {
        setNewArrivals(response.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch new arrivals:', err);
    }
  };

  // Fetch bestsellers
  const fetchBestsellers = async () => {
    try {
      const response = await axios.get('/products/bestsellers');
      if (response.data.success) {
        setBestsellers(response.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch bestsellers:', err);
    }
  };

  // Fetch single product
  const fetchProduct = async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/product/${productId}`);
      if (response.data.success) {
        setLoading(false);
        return response.data.product;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
      setLoading(false);
      return null;
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (productId) => {
    try {
      const response = await axios.get(`/products/related/${productId}`);
      if (response.data.success) {
        return response.data.relatedProducts;
      }
    } catch (err) {
      console.error('Failed to fetch related products:', err);
      return [];
    }
  };

  // Search products
  const searchProducts = async (query) => {
    setSearchQuery(query);
    return await fetchProducts({ keyword: query });
  };

  // Filter products
  const applyFilters = async (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    const params = { ...newFilters };
    if (searchQuery) params.keyword = searchQuery;
    await fetchProducts(params);
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchFeaturedProducts(),
        fetchNewArrivals(),
        fetchBestsellers()
      ]);
    };
    
    fetchInitialData();
  }, []);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <ProductContext.Provider value={{
      products,
      featuredProducts,
      newArrivals,
      bestsellers,
      loading,
      error,
      searchQuery,
      filters,
      fetchProducts,
      fetchProduct,
      fetchFeaturedProducts,
      fetchNewArrivals,
      fetchBestsellers,
      fetchRelatedProducts,
      searchProducts,
      applyFilters,
      setSearchQuery,
      setFilters,
      clearError
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;
