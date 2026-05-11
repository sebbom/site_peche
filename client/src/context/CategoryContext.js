import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
        setLoading(false);
        return response.data.categories;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      setLoading(false);
    }
  };

  // Fetch featured categories
  const fetchFeaturedCategories = async () => {
    try {
      const response = await axios.get('/categories/featured');
      if (response.data.success) {
        setFeaturedCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch featured categories:', err);
    }
  };

  // Fetch parent categories
  const fetchParentCategories = async () => {
    try {
      const response = await axios.get('/categories/parents');
      if (response.data.success) {
        setParentCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch parent categories:', err);
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async (parentId) => {
    try {
      const response = await axios.get(`/categories/parent/${parentId}`);
      if (response.data.success) {
        return response.data.subCategories;
      }
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
      return [];
    }
  };

  // Fetch single category
  const fetchCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/category/${categoryId}`);
      if (response.data.success) {
        setSelectedCategory(response.data.category);
        setLoading(false);
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch category');
      setLoading(false);
      return null;
    }
  };

  // Get category by ID
  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat._id === categoryId);
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Get products by category
  const getProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`/products/category/${categoryId}`);
      if (response.data.success) {
        return response.data;
      }
    } catch (err) {
      console.error('Failed to fetch products by category:', err);
      return { success: false, products: [] };
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchFeaturedCategories(),
        fetchParentCategories()
      ]);
    };
    
    fetchInitialData();
  }, []);

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      featuredCategories,
      parentCategories,
      selectedCategory,
      loading,
      error,
      fetchCategories,
      fetchFeaturedCategories,
      fetchParentCategories,
      fetchSubCategories,
      fetchCategory,
      getCategoryById,
      getCategoryName,
      getProductsByCategory,
      setSelectedCategory,
      clearError
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export default CategoryContext;
