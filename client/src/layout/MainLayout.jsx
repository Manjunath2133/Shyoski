import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import { motion } from 'framer-motion';

const drawerWidth = 240;

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -20,
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
};

const MainLayout = ({ children }) => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await auth.signOut();
        setUser(null);
        navigate('/login');
    };

    const commonNav = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
    ];

    const studentNav = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/student-dashboard' },
        { text: 'Projects', icon: <WorkIcon />, path: '/projects' },
        { text: 'Companies', icon: <BusinessIcon />, path: '/companies' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ];

    const evaluatorNav = [
        { text: 'Dashboard', icon: <FactCheckIcon />, path: '/evaluator-dashboard' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ];

    const adminNav = [
        { text: 'Dashboard', icon: <AdminPanelSettingsIcon />, path: '/admin' },
        { text: 'Projects', icon: <WorkIcon />, path: '/projects' },
        { text: 'Companies', icon: <BusinessIcon />, path: '/companies' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ];

    const getNavItems = () => {
        switch (user?.role) {
            case 'student': return [...commonNav, ...studentNav];
            case 'evaluator': return [...commonNav, ...evaluatorNav];
            case 'admin': return [...commonNav, ...adminNav];
            default: return commonNav;
        }
    };

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {getNavItems().map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: 'primary.main',
                }}
            >
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
                    <img src="/logo.svg" alt="Shyoski Logo" style={{ height: '40px', marginRight: '16px' }} />

                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar src={user?.photoUrl} alt={user?.name} />
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
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <motion.div
                    key={location.pathname}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                >
                    {children}
                </motion.div>
            </Box>
        </Box>
    );
};

export default MainLayout;
