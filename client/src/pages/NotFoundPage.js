import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';

const NotFoundPage = () => {
  return (
    <div className="error-page">
      <Container maxWidth="sm">
        <Box textAlign="center" py={10}>
          <Typography variant="h1" className="error-page-code">
            404
          </Typography>
          <Typography variant="h4" className="error-page-title">
            Page non trouvée
          </Typography>
          <Typography variant="body1" className="error-page-description">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </Typography>
          <Box className="error-page-actions" mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/"
              size="large"
            >
              Retour à l'accueil
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/contact"
              size="large"
            >
              Contactez-nous
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default NotFoundPage;
