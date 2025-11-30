import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Grid, Card, CardContent, Link, Chip, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { BASE_URL } from '../utils/api';

const PublicProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const userResponse = await fetch(`${BASE_URL}/users/${userId}`);
                const userData = await userResponse.json();
                setUser(userData);

                const projectsResponse = await fetch(`${BASE_URL}/projects/user/${userId}`);
                const projectsData = await projectsResponse.json();
                setProjects(projectsData);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!user) {
        return <Typography variant="h4" align="center" sx={{ mt: 4 }}>User not found</Typography>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Avatar src={user.photoUrl} alt={user.name} sx={{ width: 150, height: 150, margin: 'auto' }} />
                <Typography variant="h3" sx={{ mt: 2 }}>{user.name}</Typography>
                <Typography variant="h6" color="text.secondary">{user.bio}</Typography>
                <Box sx={{ mt: 2 }}>
                    {user.skills?.map(skill => <Chip label={skill} key={skill} sx={{ mr: 1, mb: 1 }} />)}
                </Box>
                <Box sx={{ mt: 2 }}>
                    {user.socialLinks?.linkedin && <Link href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" sx={{ mr: 2 }}>LinkedIn</Link>}
                    {user.socialLinks?.twitter && <Link href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" sx={{ mr: 2 }}>Twitter</Link>}
                    {user.socialLinks?.github && <Link href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub</Link>}
                </Box>
            </Box>

            <Typography variant="h4" sx={{ mt: 6, mb: 4 }}>Projects</Typography>
            <Grid container spacing={4}>
                {projects.map(project => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{project.title}</Typography>
                                    <Typography color="text.secondary">{project.description}</Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </motion.div>
    );
};

export default PublicProfilePage;
