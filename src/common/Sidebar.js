import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, School as SchoolIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import IbaLogo from '../assets/IBA.png'; // Adjust the path as necessary


const drawerWidth = 240;

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#003366', // Deep Blue for the sidebar background
            color: '#FFFFFF', // White text color for contrast
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ padding: '10px' }}>
        <img src={IbaLogo} alt="University Logo" style={{ width: '100%', marginBottom: '10px' }} /> {/* Logo */}
        <Typography variant="h6" sx={{ textAlign: 'center', fontFamily: 'Playfair Display, serif' }}>
            AcademiQ
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: '#FFD700' }} /> {/* Gold color divider */}
        <List>
          <ListItem component={Link} to="/home" disablePadding>
            <ListItemButton sx={{ '&:hover': { backgroundColor: '#002244' },color:'#FFFFFF' }}> {/* Darker Blue on hover */}
              <ListItemIcon sx={{ color: '#FFFFFF' }}> {/* Gold color icons */}
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem component={Link} to="/profile" disablePadding>
            <ListItemButton sx={{ '&:hover': { backgroundColor: '#002244' },color:'#FFFFFF' }}>
              <ListItemIcon sx={{ color: '#FFFFFF' }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem component={Link} to="/courses" disablePadding>
            <ListItemButton sx={{ '&:hover': { backgroundColor: '#002244' },color:'#FFFFFF' }}>
              <ListItemIcon sx={{ color: '#FFFFFF' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItemButton>
          </ListItem>
          <ListItem component={Link} to="/teachers" disablePadding>
            <ListItemButton sx={{ '&:hover': { backgroundColor: '#002244' } ,color:'#FFFFFF'}}>
              <ListItemIcon sx={{ color: '#FFFFFF' }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Teachers" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ backgroundColor: '#FFD700' }} />
        <List>
          <ListItem>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              fullWidth
              sx={{
                margin: '0 16px',
                backgroundColor: '#B22222', // Firebrick color for the logout button
                '&:hover': {
                  backgroundColor: '#8B0000', // Darker Firebrick on hover
                },
              }}
            >
              Logout
              <LogoutIcon sx={{ marginLeft: '10px' }} />
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
