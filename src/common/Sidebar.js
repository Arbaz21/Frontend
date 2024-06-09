// src/common/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 200;

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
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem component={Link} to="/home" disablePadding>
            <ListItemButton>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem component={Link} to="/profile" disablePadding>
            <ListItemButton>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem component={Link} to="/courses" disablePadding>
            <ListItemButton>
              <ListItemIcon><SchoolIcon /></ListItemIcon>
              <ListItemText primary="Courses" />
            </ListItemButton>
          </ListItem>
          <ListItem component={Link} to="/teachers" disablePadding>
            <ListItemButton>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Teachers" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
         {/* Logout Button */}
          <ListItem>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
