import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardMedia, CardContent } from '@mui/material';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <Box 
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          padding: '80px 0',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: '700', marginBottom: '20px' }}>
            À propos de Site Pêche
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>
            Votre boutique en ligne spécialisée dans les articles de pêche de qualité professionnelle
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ padding: '60px 0' }}>
        {/* Our Story */}
        <Paper elevation={0} sx={{ padding: '40px', marginBottom: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Typography variant="h3" sx={{ marginBottom: '20px', fontWeight: '700' }}>
            Notre Histoire
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', lineHeight: '1.8', marginBottom: '20px' }}>
            Fondée en 2024, Site Pêche est née de la passion de la pêche et du désir de fournir aux pêcheurs,
            amateurs et professionnels, un accès facile à du matériel de qualité à des prix compétitifs.
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', lineHeight: '1.8' }}>
            Notre équipe est composée de pêcheurs expérimentés qui comprennent vos besoins et sélectionnent
            soigneusement chaque produit pour vous offrir le meilleur équipement possible.
          </Typography>
        </Paper>

        {/* Our Mission */}
        <Grid container spacing={4} sx={{ marginBottom: '40px' }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: '100%' }}>
              <Typography variant="h4" sx={{ marginBottom: '16px', fontWeight: '700', color: '#1976d2' }}>
                Notre Mission
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: '1.8' }}>
                Notre mission est simple : fournir aux pêcheurs de tous niveaux du matériel de qualité
                qui améliore leur expérience de pêche. Nous croyons que chaque pêcheur mérite d'avoir
                accès à du bon équipement, quel que soit son budget.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: '100%' }}>
              <Typography variant="h4" sx={{ marginBottom: '16px', fontWeight: '700', color: '#1976d2' }}>
                Notre Vision
              </Typography>
              <Typography variant="body1" sx={{ color: '#555', lineHeight: '1.8' }}>
                Nous visons à devenir la destination en ligne préférée pour tous les pêcheurs en France et
                au-delà, en offrant une sélection complète d'articles de pêche, un service client exceptionnel
                et une expérience d'achat fluide et sécurisée.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Our Values */}
        <Paper elevation={0} sx={{ padding: '40px', marginBottom: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Typography variant="h3" sx={{ marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            Nos Valeurs
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Qualité', description: 'Nous ne proposons que des produits de haute qualité testés et approuvés par notre équipe.', icon: '⭐' },
              { title: 'Service Client', description: 'Notre équipe est là pour vous aider avant, pendant et après votre achat.', icon: '💬' },
              { title: 'Prix Compétitifs', description: 'Nous travaillons directement avec les fabricants pour vous offrir les meilleurs prix.', icon: '💰' },
              { title: 'Livraison Rapide', description: 'Nous expédions vos commandes rapidement pour que vous puissiez pêcher sans attendre.', icon: '🚚' },
              { title: 'Satisfaction Garantie', description: 'Si vous n\'êtes pas satisfait, nous vous remboursons ou échangeons votre produit.', icon: '🏆' },
              { title: 'Respect de l\'Environnement', description: 'Nous encourageons la pêche responsable et le respect de la nature.', icon: '🌿' }
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ textAlign: 'center', padding: '20px' }}>
                  <Typography variant="h2" sx={{ marginBottom: '12px' }}>
                    {value.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ marginBottom: '8px', fontWeight: '600' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: '1.6' }}>
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Our Team */}
        <Paper elevation={0} sx={{ padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <Typography variant="h3" sx={{ marginBottom: '20px', fontWeight: '700', textAlign: 'center' }}>
            Notre Équipe
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: 'Jean Dupont', role: 'Fondateur & Directeur', bio: 'Pêcheur passionné depuis plus de 20 ans, expert en pêche à la mouche.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: 'Marie Martin', role: 'Responsable Marketing', bio: 'Spécialiste du marketing digital et pêcheuse occasionnelle.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: 'Pierre Bernard', role: 'Responsable Logistique', bio: 'Expert en gestion des stocks et livraison rapide.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
              { name: 'Sophie Leroy', role: 'Service Client', bio: 'Toujours prête à vous aider avec vos questions et problèmes.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={member.image}
                    alt={member.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ padding: '20px', textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: '700', marginBottom: '4px' }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#1976d2', marginBottom: '12px' }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', lineHeight: '1.6' }}>
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default AboutPage;
