import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ${page} = () => {
  return (
    <div className="${page.toLowerCase()}-page">
      <Container maxWidth="sm" style={{ padding: '60px 0' }}>
        <Typography variant="h3" style={{ marginBottom: '24px', fontWeight: '700', textAlign: 'center' }}>
          {${page.replace(/Page$/, '')}}
        </Typography>
        <Typography variant="body1" style={{ color: '#666', textAlign: 'center' }}>
          Page en construction - Coming Soon!
        </Typography>
      </Container>
    </div>
  );
};

export default ${page};
