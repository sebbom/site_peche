import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent, CardActions, Button, Chip, Paper, TextField, MenuItem, Select, FormControl, InputLabel, Pagination, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { ShoppingCart, FavoriteBorder, Favorite, Search, FilterList, Sort } from '@mui/icons-material';

const ProductsPage = () => {
  const { products, loading, fetchProducts, searchProducts, applyFilters, filters } = useProducts();
  const { categories } = useCategories();
  const { addToCart, isInCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [wishlist, setWishlist] = useState([]);

  const itemsPerPage = 12;

  useEffect(() => {
    const params = {
      keyword: searchQuery,
      category: selectedCategory,
      page
    };
    fetchProducts(params);
  }, [searchQuery, selectedCategory, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    searchProducts(searchQuery);
    setSearchParams({ keyword: searchQuery, category: selectedCategory, page: 1 });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
    setSearchParams({ keyword: searchQuery, category: categoryId, page: 1 });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === 'price-asc') {
      setSortBy('price');
      setSortOrder('asc');
    } else if (value === 'price-desc') {
      setSortBy('price');
      setSortOrder('desc');
    } else if (value === 'newest') {
      setSortBy('createdAt');
      setSortOrder('desc');
    } else if (value === 'rating') {
      setSortBy('ratings');
      setSortOrder('desc');
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setSearchParams({ keyword: searchQuery, category: selectedCategory, page: value });
  };

  const filteredProducts = products
    .filter(product => {
      if (selectedCategory && product.category?._id !== selectedCategory) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'ratings') {
        return sortOrder === 'asc' ? a.ratings - b.ratings : b.ratings - a.ratings;
      } else {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="spinner"></div>
      </Box>
    );
  }

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <Box className="breadcrumb" style={{ backgroundColor: '#f5f5f5', padding: '16px 0' }}>
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/" style={{ color: '#666', textDecoration: 'none' }}>
              Accueil
            </MuiLink>
            <Typography color="text.primary">Produits</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" style={{ padding: '40px 0' }}>
        <Typography variant="h2" style={{ marginBottom: '12px', fontWeight: '700' }}>
          Nos Produits
        </Typography>
        <Typography variant="body1" style={{ color: '#666', marginBottom: '30px' }}>
          Découvrez notre large gamme d'articles de pêche de qualité
        </Typography>

        {/* Search and Filter Bar */}
        <Paper style={{ padding: '20px', marginBottom: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems="center">
            {/* Search */}
            <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '12px' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search style={{ color: '#999', marginRight: '8px' }} />
                }}
                size="small"
              />
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                startIcon={<Search />}
                size="small"
                style={{ height: '40px' }}
              >
                Rechercher
              </Button>
            </form>

            {/* Category Filter */}
            <FormControl size="small" style={{ minWidth: '200px' }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                label="Catégorie"
              >
                <MenuItem value="">Toutes les catégories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sort */}
            <FormControl size="small" style={{ minWidth: '180px' }}>
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy === 'price' && sortOrder === 'asc' ? 'price-asc' : 
                       sortBy === 'price' && sortOrder === 'desc' ? 'price-desc' :
                       sortBy === 'ratings' && sortOrder === 'desc' ? 'rating' : 'newest'}
                onChange={handleSortChange}
                label="Trier par"
                startAdornment={<Sort style={{ marginRight: '8px', color: '#999' }} />}
              >
                <MenuItem value="newest">Nouveautés</MenuItem>
                <MenuItem value="price-asc">Prix: Croissant</MenuItem>
                <MenuItem value="price-desc">Prix: Décroissant</MenuItem>
                <MenuItem value="rating">Meilleures notes</MenuItem>
              </Select>
            </FormControl>

            {/* View Toggle */}
            <Box display="flex" gap={1}>
              <Button
                variant={view === 'grid' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setView('grid')}
                size="small"
                style={{ minWidth: '40px' }}
              >
                <i className="fas fa-th"></i>
              </Button>
              <Button
                variant={view === 'list' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setView('list')}
                size="small"
                style={{ minWidth: '40px' }}
              >
                <i className="fas fa-list"></i>
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Results Count */}
        <Typography variant="body2" style={{ color: '#666', marginBottom: '20px' }}>
          {filteredProducts.length} produits trouvés
        </Typography>

        {/* Products Grid/List */}
        {paginatedProducts.length > 0 ? (
          <>
            {view === 'grid' ? (
              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <Card
                      style={{
                        height: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                      }}
                    >
                      {/* Badges */}
                      {product.isNew && (
                        <Chip
                          label="Nouveau"
                          color="success"
                          size="small"
                          style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 1 }}
                        />
                      )}
                      {product.isBestseller && (
                        <Chip
                          label="Meilleure Vente"
                          color="primary"
                          size="small"
                          style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 1 }}
                        />
                      )}
                      {product.discountPrice > 0 && (
                        <Chip
                          label={`-${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`}
                          color="error"
                          size="small"
                          style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 1 }}
                        />
                      )}

                      {/* Wishlist Button */}
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          zIndex: 1,
                          backgroundColor: 'white',
                          borderRadius: '50%'
                        }}
                      >
                        {wishlist.includes(product._id) ? (
                          <Favorite style={{ color: '#f44336' }} />
                        ) : (
                          <FavoriteBorder style={{ color: '#666' }} />
                        )}
                      </IconButton>

                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                        alt={product.name}
                      />
                      <CardContent style={{ padding: '16px' }}>
                        <Typography variant="body1" style={{ fontWeight: '600', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.name}
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          {product.discountPrice > 0 ? (
                            <>
                              <Typography variant="body2" style={{ color: '#999', textDecoration: 'line-through' }}>
                                {product.price.toFixed(2)} €
                              </Typography>
                              <Typography variant="h6" style={{ color: '#f44336', fontWeight: '700' }}>
                                {product.discountPrice.toFixed(2)} €
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h6" style={{ color: '#1976d2', fontWeight: '700' }}>
                              {product.price.toFixed(2)} €
                            </Typography>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: i < Math.floor(product.ratings || 0) ? '#ffc107' : '#ddd' }}>
                              ⭐
                            </span>
                          ))}
                          <Typography variant="caption" style={{ color: '#666', marginLeft: '4px' }}>
                            ({product.numOfReviews || 0})
                          </Typography>
                        </div>
                        <Typography variant="body2" style={{ color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '12px' }}>
                          {product.description}
                        </Typography>
                      </CardContent>
                      <CardActions style={{ padding: '0 16px 16px', justifyContent: 'space-between' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product._id);
                          }}
                          startIcon={<ShoppingCart />}
                        >
                          Ajouter au panier
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          color="primary"
                          component={Link}
                          to={`/products/${product._id}`}
                        >
                          Voir les détails
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box>
                {paginatedProducts.map((product) => (
                  <Card key={product._id} style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <Box display="flex" style={{ padding: '20px' }}>
                      <CardMedia
                        component="img"
                        style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                        image={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                        alt={product.name}
                      />
                      <Box style={{ flex: 1, paddingLeft: '20px' }}>
                        <Typography variant="h6" style={{ fontWeight: '600', marginBottom: '8px' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#666', marginBottom: '12px' }}>
                          {product.description}
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          {product.discountPrice > 0 ? (
                            <>
                              <Typography variant="body2" style={{ color: '#999', textDecoration: 'line-through' }}>
                                {product.price.toFixed(2)} €
                              </Typography>
                              <Typography variant="h5" style={{ color: '#f44336', fontWeight: '700' }}>
                                {product.discountPrice.toFixed(2)} €
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="h5" style={{ color: '#1976d2', fontWeight: '700' }}>
                              {product.price.toFixed(2)} €
                            </Typography>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: i < Math.floor(product.ratings || 0) ? '#ffc107' : '#ddd' }}>
                              ⭐
                            </span>
                          ))}
                          <Typography variant="caption" style={{ color: '#666', marginLeft: '4px' }}>
                            ({product.numOfReviews || 0})
                          </Typography>
                        </div>
                        <Box display="flex" gap={2}>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddToCart(product._id)}
                            startIcon={<ShoppingCart />}
                          >
                            Ajouter au panier
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            component={Link}
                            to={`/products/${product._id}`}
                          >
                            Voir les détails
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Paper style={{ padding: '60px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <i className="fas fa-search" style={{ fontSize: '4rem', color: '#ddd', marginBottom: '20px' }}></i>
            <Typography variant="h5" style={{ color: '#666', marginBottom: '12px' }}>
              Aucun produit trouvé
            </Typography>
            <Typography variant="body2" style={{ color: '#999', marginBottom: '20px' }}>
              Essayez de modifier vos critères de recherche ou de filtrage
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/products"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setPage(1);
              }}
            >
              Réinitialiser les filtres
            </Button>
          </Paper>
        )}
      </Container>
    </div>
  );
};

export default ProductsPage;
