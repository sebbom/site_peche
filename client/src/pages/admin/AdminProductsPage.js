import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ${page} = () => {
  return (
    <div className="${page.toLowerCase()}-page">
      <Container maxWidth="lg" style={{ padding: '60px 0' }}>
        <Typography variant="h3" style={{ marginBottom: '24px', fontWeight: '700' }}>
          {${page.replace(/Page$/, '')}}
        </Typography>
        <Typography variant="body1" style={{ color: '#666' }}>
          Admin page - Coming Soon!
        </Typography>
      </Container>
    </div>
  );
};

export default ${page};
