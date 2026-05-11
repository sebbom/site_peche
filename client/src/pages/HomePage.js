import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent, CardActions, Button, Chip, Paper } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const HomePage = () => {
  const { featuredProducts, newArrivals, bestsellers, loading } = useProducts();
  const { featuredCategories, loading: categoriesLoading } = useCategories();
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Bienvenue sur Site Pêche',
      subtitle: 'Découvrez notre collection d\'articles de pêche de qualité professionnelle',
      description: 'Des cannes aux leurres, nous avons tout ce dont vous avez besoin pour une expérience de pêche réussie.',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Découvrir nos produits',
      ctaLink: '/products'
    },
    {
      id: 2,
      title: 'Équipement Premium',
      subtitle: 'Matériel de pêche pour professionnels et amateurs',
      description: 'Des marques de confiance pour des résultats exceptionnels.',
      image: 'https://images.unsplash.com/photo-1514539079130-25950c84af29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Voir les nouveautés',
      ctaLink: '/products'
    },
    {
      id: 3,
      title: 'Livraison Rapide',
      subtitle: 'Recevez votre matériel en 24-48h',
      description: 'Livraison gratuite à partir de 100€ d\'achat.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Commander maintenant',
      ctaLink: '/products'
    }
  ]);

  const fishingCategories = [
    { name: 'Pêche au coup', icon: '🎣', description: 'Matériel pour la pêche en eau douce' },
    { name: 'Pêche à la mouche', icon: '🪰', description: 'Canne, mouches et accessoires' },
    { name: 'Pêche en mer', icon: '🌊', description: 'Équipement pour la pêche maritime' },
    { name: 'Pêche au carnassier', icon: '🐟', description: 'Leurres et cannes pour carnassiers' },
  ];

  const shippingInfo = [
    { icon: '🚚', title: 'Livraison Gratuite', description: 'À partir de 100€ d\'achat' },
    { icon: '💳', title: 'Paiement Sécurisé', description: 'CB, PayPal, virement' },
    { icon: '🔄', title: 'Retours Faciles', description: '30 jours pour changer d\'avis' },
    { icon: '📞', title: 'Support 24/7', description: 'Service client disponible' },
  ];

  if (loading || categoriesLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="spinner"></div>
      </Box>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Banner Carousel */}
      <section className="hero">
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={true}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          transitionTime={500}
        >
          {banners.map((banner) => (
            <div key={banner.id} style={{ position: 'relative', height: '500px' }}>
              <img
                src={banner.image}
                alt={banner.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.7)'
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white',
                padding: '40px'
              }}>
                <div>
                  <Typography variant="h2" style={{ fontWeight: '700', marginBottom: '16px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    {banner.title}
                  </Typography>
                  <Typography variant="h5" style={{ marginBottom: '16px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {banner.subtitle}
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '24px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {banner.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={Link}
                    to={banner.ctaLink}
                    style={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      padding: '12px 32px',
                      fontSize: '1.125rem',
                      fontWeight: '600'
                    }}
                  >
                    {banner.ctaText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Fishing Categories */}
      <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" style={{ marginBottom: '12px', fontWeight: '700' }}>
            Catégories de Pêche
          </Typography>
          <Typography variant="body1" align="center" style={{ color: '#666', marginBottom: '40px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Découvrez notre large gamme de matériel pour tous les types de pêche
          </Typography>
          
          <Grid container spacing={3}>
            {fishingCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '24px',
                    borderRadius: '8px',
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
                  <Typography variant="h2" style={{ marginBottom: '16px' }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="h6" style={{ marginBottom: '8px', fontWeight: '600' }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" style={{ color: '#666' }}>
                    {category.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <section style={{ padding: '60px 0', backgroundColor: '#f5f5f5' }}>
          <Container maxWidth="lg">
            <Typography variant="h2" align="center" style={{ marginBottom: '12px', fontWeight: '700' }}>
              Catégories Phares
            </Typography>
            <Typography variant="body1" align="center" style={{ color: '#666', marginBottom: '40px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Nos catégories les plus populaires
            </Typography>
            
            <Grid container spacing={3}>
              {featuredCategories.slice(0, 4).map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category._id}>
                  <Card
                    component={Link}
                    to={`/category/${category._id}`}
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
                      height="160"
                      image={category.image?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={category.name}
                    />
                    <CardContent style={{ padding: '16px' }}>
                      <Typography variant="h6" style={{ fontWeight: '600', marginBottom: '8px' }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {category.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>
      )}

      {/* Featured Products */}
      <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <Typography variant="h2" style={{ marginBottom: '12px', fontWeight: '700' }}>
                Produits Phares
              </Typography>
              <Typography variant="body1" style={{ color: '#666' }}>
                Nos articles les plus populaires
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="/products"
              style={{ borderRadius: '20px' }}
            >
              Voir tout
            </Button>
          </div>
          
          {featuredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {featuredProducts.slice(0, 8).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <Card
                    component={Link}
                    to={`/products/${product._id}`}
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
                    {product.isNew && (
                      <Chip
                        label="Nouveau"
                        color="success"
                        size="small"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          zIndex: 1
                        }}
                      />
                    )}
                    {product.isBestseller && (
                      <Chip
                        label="Meilleure Vente"
                        color="primary"
                        size="small"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          zIndex: 1
                        }}
                      />
                    )}
                    {product.discountPrice > 0 && (
                      <Chip
                        label={`-${Math.round(((product.price - product.discountPrice) / product.price) * 100)}%`}
                        color="error"
                        size="small"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          zIndex: 1
                        }}
                      />
                    )}
                    
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < Math.floor(product.ratings || 0) ? '#ffc107' : '#ddd' }}>
                            ⭐
                          </span>
                        ))}
                        <Typography variant="caption" style={{ color: '#666', marginLeft: '4px' }}>
                          ({product.numOfReviews || 0})
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Typography variant="h6" style={{ color: '#666' }}>
                Aucun produit phare disponible
              </Typography>
              <Typography variant="body2" style={{ color: '#999', marginTop: '8px' }}>
                Revenez plus tard pour découvrir nos produits phares
              </Typography>
            </Paper>
          )}
        </Container>
      </section>

      {/* New Arrivals */}
      <section style={{ padding: '60px 0', backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <Typography variant="h2" style={{ marginBottom: '12px', fontWeight: '700' }}>
                Nouveautés
              </Typography>
              <Typography variant="body1" style={{ color: '#666' }}>
                Nos derniers articles ajoutés
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="/products?sort=new"
              style={{ borderRadius: '20px' }}
            >
              Voir tout
            </Button>
          </div>
          
          {newArrivals.length > 0 ? (
            <Grid container spacing={3}>
              {newArrivals.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <Card
                    component={Link}
                    to={`/products/${product._id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      height: '100%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Chip
                      label="Nouveau"
                      color="success"
                      size="small"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        zIndex: 1
                      }}
                    />
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={product.name}
                    />
                    <CardContent style={{ padding: '16px' }}>
                      <Typography variant="body1" style={{ fontWeight: '600', marginBottom: '8px' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="h6" style={{ color: '#1976d2', fontWeight: '700' }}>
                        {product.price.toFixed(2)} €
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '8px' }}>
              <Typography variant="h6" style={{ color: '#666' }}>
                Aucun nouveau produit disponible
              </Typography>
            </Paper>
          )}
        </Container>
      </section>

      {/* Bestsellers */}
      <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <Typography variant="h2" style={{ marginBottom: '12px', fontWeight: '700' }}>
                Meilleures Ventes
              </Typography>
              <Typography variant="body1" style={{ color: '#666' }}>
                Les articles les plus populaires de nos clients
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="/products?sort=bestseller"
              style={{ borderRadius: '20px' }}
            >
              Voir tout
            </Button>
          </div>
          
          {bestsellers.length > 0 ? (
            <Grid container spacing={3}>
              {bestsellers.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <Card
                    component={Link}
                    to={`/products/${product._id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      height: '100%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Chip
                      label="Meilleure Vente"
                      color="primary"
                      size="small"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        zIndex: 1
                      }}
                    />
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                      alt={product.name}
                    />
                    <CardContent style={{ padding: '16px' }}>
                      <Typography variant="body1" style={{ fontWeight: '600', marginBottom: '8px' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="h6" style={{ color: '#1976d2', fontWeight: '700' }}>
                        {product.price.toFixed(2)} €
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Typography variant="h6" style={{ color: '#666' }}>
                Aucun produit populaire disponible
              </Typography>
            </Paper>
          )}
        </Container>
      </section>

      {/* Shipping Info */}
      <section style={{ padding: '60px 0', backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {shippingInfo.map((info, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="h2" style={{ marginBottom: '16px' }}>
                    {info.icon}
                  </Typography>
                  <Typography variant="h6" style={{ marginBottom: '8px', fontWeight: '600' }}>
                    {info.title}
                  </Typography>
                  <Typography variant="body2" style={{ color: '#666' }}>
                    {info.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <Container maxWidth="lg">
          <Typography variant="h3" className="newsletter-title">
            Abonnez-vous à notre newsletter
          </Typography>
          <Typography variant="body1" className="newsletter-subtitle">
            Recevez nos dernières offres et actualités directement dans votre boîte mail
          </Typography>
          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              S'abonner
            </button>
          </form>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
