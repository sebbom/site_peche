import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Box, Container, Typography, Paper, Grid, Card, CardMedia, CardContent, Button, Divider, TextField, IconButton } from '@mui/material';
import { ShoppingCart, Delete, Add, Remove, ArrowBack } from '@mui/icons-material';

const CartPage = () => {
  const { cartItems, subtotal, itemCount, updateCartItem, removeFromCart, clearCart, calculateShipping, calculateTax, calculateTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const shipping = calculateShipping();
  const tax = calculateTax();
  const total = calculateTotal();

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity > 0) {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <div className="cart-page">
      <Container maxWidth="lg" sx={{ padding: '40px 0' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <Typography variant="h3" sx={{ fontWeight: '700' }}>
            Votre Panier
          </Typography>
          {itemCount > 0 && (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<Delete />}
              onClick={handleClearCart}
            >
              Vider le panier
            </Button>
          )}
        </Box>

        {/* Empty Cart */}
        {itemCount === 0 ? (
          <Paper sx={{ padding: '60px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <ShoppingCart sx={{ fontSize: '4rem', color: '#ddd', marginBottom: '20px' }} />
            <Typography variant="h5" sx={{ color: '#666', marginBottom: '12px' }}>
              Votre panier est vide
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', marginBottom: '30px' }}>
              Ajoutez des articles à votre panier pour continuer vos achats
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/products"
              size="large"
            >
              Continuer vos achats
            </Button>
          </Paper>
        ) : (
          <>
            {/* Cart Items */}
            <Grid container spacing={3}>
              {/* Cart Items List */}
              <Grid item xs={12} md={8}>
                {cartItems.map((item) => (
                  <Paper 
                    key={item._id || item.product}
                    sx={{ 
                      padding: '20px', 
                      marginBottom: '20px', 
                      borderRadius: '8px', 
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      display: 'flex',
                      gap: '20px'
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }}
                      image={item.image || item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: '8px' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', marginBottom: '8px' }}>
                        Prix: {item.price.toFixed(2)} €
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Typography variant="body2">Quantité:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item._id || item.product, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item._id || item.product, parseInt(e.target.value) || 1)}
                            inputProps={{ style: { textAlign: 'center', width: '50px' } }}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateQuantity(item._id || item.product, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Total: {(item.price * item.quantity).toFixed(2)} €
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <IconButton onClick={() => handleRemoveItem(item._id || item.product)}>
                        <Delete color="error" />
                      </IconButton>
                      {item.stock && item.stock <= 5 && (
                        <Typography variant="caption" sx={{ color: '#ff9800', textAlign: 'right' }}>
                          Seulement {item.stock} en stock!
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}

                {/* Continue Shopping */}
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link} 
                  to="/products"
                  startIcon={<ArrowBack />}
                  fullWidth
                  sx={{ marginTop: '20px' }}
                >
                  Continuer vos achats
                </Button>
              </Grid>

              {/* Cart Summary */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ padding: '24px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
                  <Typography variant="h5" sx={{ fontWeight: '700', marginBottom: '20px' }}>
                    Récapitulatif
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Typography variant="body1">Sous-total ({itemCount} articles)</Typography>
                    <Typography variant="body1">{subtotal.toFixed(2)} €</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Typography variant="body1">Livraison</Typography>
                    <Typography variant="body1">{shipping > 0 ? `${shipping.toFixed(2)} €` : 'Gratuit'}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <Typography variant="body1">Taxes (10%)</Typography>
                    <Typography variant="body1">{tax.toFixed(2)} €</Typography>
                  </Box>

                  <Divider sx={{ margin: '16px 0' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <Typography variant="h6" sx={{ fontWeight: '700' }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: '700', color: '#1976d2' }}>
                      {total.toFixed(2)} €
                    </Typography>
                  </Box>

                  {!isAuthenticated ? (
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/login"
                      fullWidth
                      size="large"
                      sx={{ marginBottom: '12px' }}
                    >
                      Se connecter pour commander
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/checkout"
                        fullWidth
                        size="large"
                        sx={{ marginBottom: '12px' }}
                      >
                        Passer à la caisse
                      </Button>
                      <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                        Livraison gratuite à partir de 100 €
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default CartPage;
