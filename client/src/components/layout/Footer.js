import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, TextField, Button, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, Email, Phone, Room, Send } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { text: 'Tous les produits', path: '/products' },
      { text: 'Canne à pêche', path: '/category/cannes' },
      { text: 'Moulinets', path: '/category/moulinets' },
      { text: 'Leurres', path: '/category/leurres' },
      { text: 'Appâts', path: '/category/appats' },
      { text: 'Accessoires', path: '/category/accessoires' },
    ],
    customerService: [
      { text: 'Contactez-nous', path: '/contact' },
      { text: 'FAQ', path: '/faq' },
      { text: 'Livraison', path: '/shipping' },
      { text: 'Retours', path: '/returns' },
      { text: 'Politique de confidentialité', path: '/privacy-policy' },
      { text: 'Conditions générales', path: '/terms' },
    ],
    about: [
      { text: 'À propos de nous', path: '/about' },
      { text: 'Notre équipe', path: '/team' },
      { text: 'Blog', path: '/blog' },
      { text: 'Témoignages', path: '/testimonials' },
      { text: 'Partenaires', path: '/partners' },
    ],
    account: [
      { text: 'Mon compte', path: '/profile' },
      { text: 'Mes commandes', path: '/orders' },
      { text: 'Ma liste de souhaits', path: '/wishlist' },
      { text: 'Connexion', path: '/login' },
      { text: 'Inscription', path: '/register' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com/sitepeche' },
    { icon: <Instagram />, url: 'https://instagram.com/sitepeche' },
    { icon: <Twitter />, url: 'https://twitter.com/sitepeche' },
    { icon: <YouTube />, url: 'https://youtube.com/sitepeche' },
  ];

  const contactInfo = [
    { icon: <Room />, text: '123 Rue de la Pêche, 75001 Paris, France' },
    { icon: <Phone />, text: '+33 1 23 45 67 89' },
    { icon: <Email />, text: 'contact@sitepeche.com' },
  ];

  return (
    <footer className="footer">
      <Container maxWidth="lg" className="footer-content">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <div style={{ marginBottom: '20px' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <i className="fas fa-fish" style={{ fontSize: '2rem', color: '#42a5f5' }}></i>
                <Typography variant="h5" style={{ color: 'white', fontWeight: '700' }}>
                  Site Pêche
                </Typography>
              </Link>
              <Typography variant="body2" style={{ color: '#bdc3c7', lineHeight: '1.8' }}>
                Votre boutique en ligne spécialisée dans les articles de pêche de qualité professionnelle. 
                Découvrez notre large gamme de matériel pour tous les types de pêche.
              </Typography>
            </div>
            
            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <IconButton 
                  key={index} 
                  component="a" 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ backgroundColor: '#34495e', color: 'white' }}
                >
                  {link.icon}
                </IconButton>
              ))}
            </div>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {Object.entries(footerLinks).map(([key, links]) => (
                <Grid item xs={6} sm={3} key={key}>
                  <Typography variant="h6" style={{ color: 'white', marginBottom: '16px', fontWeight: '600' }}>
                    {key === 'shop' && 'Boutique'}
                    {key === 'customerService' && 'Service Client'}
                    {key === 'about' && 'À propos'}
                    {key === 'account' && 'Compte'}
                  </Typography>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {links.map((link, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>
                        <Link 
                          to={link.path} 
                          style={{ color: '#bdc3c7', transition: 'color 0.3s ease' }}
                          onMouseEnter={(e) => e.target.style.color = '#42a5f5'}
                          onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Contact Info */}
        <Box mt={4} pt={2} borderTop="1px solid #34495e">
          <Grid container spacing={4}>
            {contactInfo.map((info, index) => (
              <Grid item xs={12} sm={4} key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#42a5f5' }}>{info.icon}</span>
                <Typography variant="body2" style={{ color: '#bdc3c7' }}>
                  {info.text}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Newsletter */}
        <Box mt={4} pt={2} borderTop="1px solid #34495e">
          <Typography variant="h6" style={{ color: 'white', marginBottom: '16px' }}>
            Abonnez-vous à notre newsletter
          </Typography>
          <form style={{ display: 'flex', gap: '12px', maxWidth: '400px' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Votre adresse email"
              size="small"
              InputProps={{
                style: { backgroundColor: 'white' }
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              endIcon={<Send />}
            >
              S'abonner
            </Button>
          </form>
        </Box>
      </Container>

      {/* Footer Bottom */}
      <Box mt={4} py={2} className="footer-bottom">
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            &copy; {currentYear} Site Pêche. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
