import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Card, CardContent, Typography, Avatar, Box, CircularProgress, Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProfilePage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
    const [linkedin, setLinkedin] = useState(user?.socialLinks?.linkedin || '');
    const [twitter, setTwitter] = useState(user?.socialLinks?.twitter || '');
    const [github, setGithub] = useState(user?.socialLinks?.github || '');

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedUser = {
            ...user,
            bio,
            skills: skills.split(',').map(skill => skill.trim()),
            socialLinks: {
                linkedin,
                twitter,
                github
            }
        };

        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch('http://localhost:8000/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify(updatedUser)
            });
            const data = await response.json();
            setUser(data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!user) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, borderRadius: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar src={user.photoUrl} alt={user.name} sx={{ width: 100, height: 100, mb: 2 }} />
                        <Typography variant="h4" component="div" gutterBottom>
                            {user.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {user.email}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Role: {user.role}
                        </Typography>
                        <Button onClick={() => navigate(`/user/${user.id}`)} sx={{ mt: 2 }}>View Public Profile</Button>
                        <Button onClick={() => setIsEditing(!isEditing)} sx={{ mt: 2 }}>{isEditing ? 'Cancel' : 'Edit Profile'}</Button>
                    </Box>
                    {isEditing && (
                        <form onSubmit={handleUpdate}>
                            <TextField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} fullWidth margin="normal" />
                            <TextField label="Skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} fullWidth margin="normal" />
                            <TextField label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} fullWidth margin="normal" />
                            <TextField label="Twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} fullWidth margin="normal" />
                            <TextField label="GitHub" value={github} onChange={(e) => setGithub(e.target.value)} fullWidth margin="normal" />
                            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProfilePage;
