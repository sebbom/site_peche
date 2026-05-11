import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent, Button, Chip, TextField, Rating, Breadcrumbs, Link as MuiLink, IconButton, Tabs, Tab, Paper } from '@mui/material';
import { ShoppingCart, FavoriteBorder, Favorite, ArrowBack, ArrowForward, Share } from '@mui/icons-material';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { fetchProduct, fetchRelatedProducts, loading } = useProducts();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadProduct = async () => {
      const productData = await fetchProduct(id);
      if (productData) {
        setProduct(productData);
        const related = await fetchRelatedProducts(id);
        setRelatedProducts(related || []);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(id, quantity);
  };

  const toggleWishlist = () => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(pid => pid !== id)
        : [...prev, id]
    );
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading || !product) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="spinner"></div>
      </Box>
    );
  }

  const inCart = isInCart(id);
  const cartQuantity = getItemQuantity(id);

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <Box style={{ backgroundColor: '#f5f5f5', padding: '16px 0' }}>
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} to="/" style={{ color: '#666', textDecoration: 'none' }}>
              Accueil
            </MuiLink>
            <MuiLink component={Link} to="/products" style={{ color: '#666', textDecoration: 'none' }}>
              Produits
            </MuiLink>
            {product.category?.name && (
              <MuiLink component={Link} to={`/category/${product.category._id}`} style={{ color: '#666', textDecoration: 'none' }}>
                {product.category.name}
              </MuiLink>
            )}
            <Typography color="text.primary">{product.name}</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" style={{ padding: '40px 0' }}>
        <Grid container spacing={4}>
          {/* Product Gallery */}
          <Grid item xs={12} md={6}>
            <Box style={{ position: 'relative' }}>
              {/* Main Image */}
              <Card style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardMedia
                  component="img"
                  height="450"
                  image={product.images?.[selectedImage]?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  style={{ objectFit: 'cover' }}
                />
              </Card>

              {/* Badges */}
              <Box style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.isNew && (
                  <Chip label="Nouveau" color="success" size="small" />
                )}
                {product.isBestseller && (
                  <Chip label="Meilleure Vente" color="primary" size="small" />
                )}
                {product.isFeatured && (
                  <Chip label="En Vedette" color="secondary" size="small" />
                )}
                {product.discountPrice > 0 && (
                  <Chip 
                    label={`-${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`} 
                    color="error" 
                    size="small" 
                  />
                )}
              </Box>

              {/* Wishlist Button */}
              <IconButton
                onClick={toggleWishlist}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {wishlist.includes(id) ? (
                  <Favorite style={{ color: '#f44336' }} />
                ) : (
                  <FavoriteBorder style={{ color: '#666' }} />
                )}
              </IconButton>
            </Box>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <Box style={{ marginTop: '20px', display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: selectedImage === index ? '2px solid #1976d2' : '2px solid transparent',
                      minWidth: '80px',
                      height: '80px'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="80"
                      width="80"
                      image={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ objectFit: 'cover' }}
                    />
                  </Card>
                ))}
              </Box>
            )}

            {/* Share Button */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Share />}
              fullWidth
              style={{ marginTop: '20px' }}
              onClick={() => navigator.share({ title: product.name, url: window.location.href })}
            >
              Partager
            </Button>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" style={{ fontWeight: '700', marginBottom: '12px' }}>
              {product.name}
            </Typography>

            {/* Rating */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Rating
                name="product-rating"
                value={product.ratings || 0}
                precision={0.5}
                readOnly
                style={{ color: '#ffc107' }}
              />
              <Typography variant="body2" style={{ color: '#666' }}>
                ({product.numOfReviews || 0} avis)
              </Typography>
            </Box>

            {/* Brand */}
            {product.brand && (
              <Chip 
                label={product.brand} 
                color="primary" 
                size="small" 
                style={{ marginBottom: '16px' }}
              />
            )}

            {/* Price */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              {product.discountPrice > 0 ? (
                <>
                  <Typography variant="h4" style={{ color: '#f44336', fontWeight: '700' }}>
                    {product.discountPrice.toFixed(2)} €
                  </Typography>
                  <Typography variant="h5" style={{ color: '#999', textDecoration: 'line-through' }}>
                    {product.price.toFixed(2)} €
                  </Typography>
                </>
              ) : (
                <Typography variant="h4" style={{ color: '#1976d2', fontWeight: '700' }}>
                  {product.price.toFixed(2)} €
                </Typography>
              )}
            </Box>

            {/* Short Description */}
            <Typography variant="body1" style={{ color: '#666', marginBottom: '24px', lineHeight: '1.8' }}>
              {product.description}
            </Typography>

            {/* Stock */}
            <Typography variant="body2" style={{ color: product.stock > 0 ? '#4caf50' : '#f44336', marginBottom: '16px' }}>
              {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
            </Typography>

            {/* Quantity Selector */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Typography variant="body2">Quantité:</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  style={{ minWidth: '36px', height: '36px' }}
                >
                  -
                </Button>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (val >= 1 && val <= (product.stock || 1)) {
                      setQuantity(val);
                    }
                  }}
                  inputProps={{ style: { textAlign: 'center' } }}
                  style={{ width: '60px' }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 1)}
                  style={{ minWidth: '36px', height: '36px' }}
                >
                  +
                </Button>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2} mb={3}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCart />}
                fullWidth
                size="large"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                style={{ height: '56px' }}
              >
                {inCart ? `Dans le panier (${cartQuantity})` : 'Ajouter au panier'}
              </Button>
            </Box>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              size="large"
              style={{ height: '56px' }}
            >
              Acheter maintenant
            </Button>

            {/* Product Meta */}
            {product.tags?.length > 0 && (
              <Box mt={3}>
                <Typography variant="body2" style={{ color: '#666', marginBottom: '8px' }}>
                  Tags:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {product.tags.map((tag, index) => (
                    <Chip key={index} label={tag} color="default" size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Share Links */}
            <Box mt={3} display="flex" gap={2}>
              <Typography variant="body2" style={{ color: '#666' }}>
                Partager:
              </Typography>
              <IconButton size="small" onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                <i className="fab fa-facebook" style={{ color: '#3b5998' }}></i>
              </IconButton>
              <IconButton size="small" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${product.name}`, '_blank')}>
                <i className="fab fa-twitter" style={{ color: '#1da1f2' }}></i>
              </IconButton>
              <IconButton size="small" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <i className="fas fa-copy" style={{ color: '#666' }}></i>
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Product Tabs */}
        <Box mt={5}>
          <Paper elevation={0} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
              <Tab label="Description" />
              <Tab label="Spécifications" />
              <Tab label="Avis" />
            </Tabs>
          </Paper>

          <Box p={3}>
            {tabValue === 0 && (
              <Typography variant="body1" style={{ color: '#555', lineHeight: '1.8' }}>
                {product.description}
                {product.longDescription && (
                  <>
                    <br /><br />
                    {product.longDescription}
                  </>
                )}
              </Typography>
            )}

            {tabValue === 1 && (
              <Box>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <Box component="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px 0', fontWeight: '600', color: '#333' }}>
                            {key}:
                          </td>
                          <td style={{ padding: '12px 0', color: '#666' }}>
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                ) : (
                  <Typography variant="body2" style={{ color: '#999' }}>
                    Aucune spécification disponible pour ce produit.
                  </Typography>
                )}
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                {product.reviews && product.reviews.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={3}>
                    {product.reviews.map((review, index) => (
                      <Paper key={index} elevation={0} style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1" style={{ fontWeight: '600' }}>
                            {review.name || 'Utilisateur anonyme'}
                          </Typography>
                          <Rating value={review.rating} precision={0.5} readOnly style={{ color: '#ffc107' }} />
                        </Box>
                        {review.title && (
                          <Typography variant="subtitle2" style={{ fontWeight: '600', marginBottom: '8px' }}>
                            {review.title}
                          </Typography>
                        )}
                        <Typography variant="body2" style={{ color: '#555', lineHeight: '1.6' }}>
                          {review.comment}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
                    Aucun avis pour ce produit. Soyez le premier à laisser un avis!
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box mt={5}>
            <Typography variant="h4" style={{ fontWeight: '700', marginBottom: '24px' }}>
              Produits similaires
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct._id}>
                  <Card
                    component={Link}
                    to={`/products/${relatedProduct._id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      height: '100%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
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
                    <CardMedia
                      component="img"
                      height="200"
                      image={relatedProduct.images?.[0]?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={relatedProduct.name}
                    />
                    <CardContent style={{ padding: '16px' }}>
                      <Typography variant="body1" style={{ fontWeight: '600', marginBottom: '8px' }}>
                        {relatedProduct.name}
                      </Typography>
                      <Typography variant="h6" style={{ color: '#1976d2', fontWeight: '700' }}>
                        {relatedProduct.price.toFixed(2)} €
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default ProductDetailsPage;
