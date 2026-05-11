import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useCategories } from '../../context/CategoryContext';
import { Badge, Box, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, ShoppingCart, AccountCircle, Search, Favorite } from '@mui/icons-material';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { categories, loading } = useCategories();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const navItems = [
    { text: 'Accueil', path: '/' },
    { text: 'Produits', path: '/products' },
    { text: 'Catégories', path: '/categories' },
    { text: 'À propos', path: '/about' },
    { text: 'Contact', path: '/contact' },
    { text: 'Blog', path: '/blog' },
  ];

  const authItems = [
    { text: 'Connexion', path: '/login', show: !isAuthenticated },
    { text: 'Inscription', path: '/register', show: !isAuthenticated },
    { text: 'Mon Compte', path: '/profile', show: isAuthenticated },
    { text: 'Mes Commandes', path: '/orders', show: isAuthenticated },
    { text: 'Admin', path: '/admin', show: isAuthenticated && user?.role === 'admin' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={handleDrawerToggle}>
        <CloseIcon />
      </IconButton>
      
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        {!loading && categories.slice(0, 5).map((category) => (
          <ListItem button key={category._id} component={Link} to={`/category/${category._id}`}>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
        
        {authItems.filter(item => item.show).map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        {isAuthenticated && (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Déconnexion" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Mobile menu button */}
        <IconButton 
          color="inherit" 
          aria-label="open drawer" 
          edge="start" 
          onClick={handleDrawerToggle} 
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <i className="fas fa-fish"></i>
          <span>Site Pêche</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-nav" style={{ display: mobileOpen ? 'flex' : 'none' }}>
          {navItems.map((item) => (
            <li key={item.text} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.text}
              </Link>
            </li>
          ))}
          
          {!loading && categories.slice(0, 3).map((category) => (
            <li key={category._id} className="nav-item">
              <Link 
                to={`/category/${category._id}`} 
                className="nav-link"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Search */}
          <IconButton onClick={handleSearchToggle} color="inherit">
            <Search />
          </IconButton>

          {/* Wishlist */}
          <IconButton component={Link} to="/wishlist" color="inherit">
            <Favorite />
          </IconButton>

          {/* Cart */}
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={itemCount} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Account */}
          {isAuthenticated ? (
            <>
              <IconButton component={Link} to="/profile" color="inherit">
                <AccountCircle />
              </IconButton>
              <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '8px' }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ marginRight: '8px' }}>
                Connexion
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary">
                Inscription
              </button>
            </>
          )}
        </div>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {drawer}
        </Drawer>

        {/* Search overlay for mobile */}
        {searchOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '500px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
                <button type="submit" className="btn btn-primary">
                  Rechercher
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="btn btn-secondary">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
