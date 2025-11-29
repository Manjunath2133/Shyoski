import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, githubProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useUser } from '../context/UserContext';
import { Container, Paper, Typography, Box, Button, Grid } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleSignIn = async (provider) => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Authentication error:', error);
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 2,
                        }}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography component="h1" variant="h4" fontWeight="bold">
                                Welcome to Shyoski
                            </Typography>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
                                Sign in to continue
                            </Typography>
                        </motion.div>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        startIcon={<GoogleIcon />}
                                        onClick={() => handleSignIn(googleProvider)}
                                        sx={{ py: 1.5 }}
                                    >
                                        Sign in with Google
                                    </Button>
                                </motion.div>
                            </Grid>
                            <Grid item xs={12}>
                                <motion.div variants={itemVariants} style={{ width: '100%' }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<GitHubIcon />}
                                        onClick={() => handleSignIn(githubProvider)}
                                        sx={{ py: 1.5 }}
                                    >
                                        Sign in with GitHub
                                    </Button>
                                </motion.div>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default LoginPage;
