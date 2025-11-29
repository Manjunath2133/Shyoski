import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const PublicLayout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <img src="/logo.svg" alt="Shyoski Logo" style={{ height: '40px', marginRight: '16px', cursor: 'pointer' }} onClick={() => navigate('/')} />

                    <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ mt: 4, mb: 4 }}>
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                >
                    {children}
                </motion.div>
            </Container>
            <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
                <Container maxWidth="sm">
                    <Typography variant="body2" align="center">
                        {'© '}
                        {new Date().getFullYear()}
                        {' Shyoski. All rights reserved.'}
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default PublicLayout;
