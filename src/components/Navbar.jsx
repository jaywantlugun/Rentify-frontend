import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../security/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignInClick = () => {
        navigate('/login');
    };

    const handlePostPropertyClick = () => {
        navigate('/property');
    };

    const handleMyPropertiesClick = () => {
        navigate('/my-properties');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleLogout = async (event) => {
        event.preventDefault();
        auth.logout();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 ,fontWeight: 'bold', fontFamily: 'sans-serif',  color: 'black'}}>
                Rentify
            </Typography>
            <List>
                <ListItem button onClick={handleHomeClick}>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={handleMyPropertiesClick}>
                    <ListItemText primary="My Properties" />
                </ListItem>
                <ListItem button onClick={handlePostPropertyClick}>
                    <ListItemText primary="Post Property" />
                </ListItem>
                {auth.isAuthenticated ? (
                    <>
                        <ListItem button onClick={handleProfileMenuOpen}>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button onClick={handleLogout}>
                            <ListItemText primary="Sign Out" />
                        </ListItem>
                    </>
                ) : (
                    <ListItem button onClick={handleSignInClick}>
                        <ListItemText primary="Sign In" />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap onClick={handleHomeClick} sx={{ cursor: 'pointer', display: { xs: 'none', sm: 'block' } ,fontSize:'1.5rem' ,fontWeight: 'bold', fontFamily: 'sans-serif',  color: 'white'} }>
                    Rentify
                </Typography>
                <Typography variant="h6" noWrap sx={{ display: { xs: 'none', sm: 'block' }, ml: '10px', mr: '10px' }}>
                    |
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
                    <Button color="inherit" onClick={handleMyPropertiesClick} startIcon={<HomeOutlinedIcon />}>
                        My Properties
                    </Button>
                    <Button color="inherit" onClick={handlePostPropertyClick} startIcon={<AddOutlinedIcon />}>
                        Post Property
                    </Button>
                </Box>
                {auth.isAuthenticated ? (
                    <>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                            <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button color="inherit" onClick={handleSignInClick}>Sign In</Button>
                )}
            </Toolbar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
