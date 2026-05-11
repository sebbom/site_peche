import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const OrderSuccessPage = () => {
  return (
    <div className="ordersuccesspage-page">
      <Container maxWidth="lg" sx={{ padding: '60px 0' }}>
        <Paper sx={{ padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Typography variant="h3" sx={{ marginBottom: '20px', fontWeight: '700' }}>
            OrderSuccess
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', lineHeight: '1.8' }}>
            Page en construction. Revenez bientôt pour découvrir notre contenu!
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default OrderSuccessPage;
