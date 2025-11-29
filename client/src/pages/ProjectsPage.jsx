import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';


const ProjectsPage = () => {
    const { user } = useUser();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            if (user) {
                setLoading(true);
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    const response = await fetch('http://localhost:8000/api/projects', {
                        headers: { 'Authorization': `Bearer ${idToken}` }
                    });
                    const data = await response.json();
                    setProjects(data);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
                setLoading(false);
            }
        };

        fetchProjects();
    }, [user]);

    const handleOpen = (project = null) => {
        setCurrentProject(project);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentProject(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectData = Object.fromEntries(formData.entries());
        
        const url = currentProject ? `http://localhost:8000/api/projects/${currentProject.id}` : 'http://localhost:8000/api/projects';
        const method = currentProject ? 'PUT' : 'POST';

        try {
            const idToken = await auth.currentUser.getIdToken();
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify(projectData)
            });
            const savedProject = await response.json();

            if (currentProject) {
                setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
            } else {
                setProjects([...projects, savedProject]);
            }
            handleClose();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            await fetch(`http://localhost:8000/api/projects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            setProjects(projects.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>My Projects</Typography>
            <Button variant="contained" onClick={() => handleOpen()}>Add Project</Button>

            {loading ? <CircularProgress sx={{ mt: 4 }} /> : (
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    {projects.map(project => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">{project.title}</Typography>
                                        <Typography color="text.secondary">{project.description}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => handleOpen(project)}>Edit</Button>
                                        <Button size="small" color="error" onClick={() => handleDelete(project.id)}>Delete</Button>
                                    </CardActions>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
                <form onSubmit={handleSave}>
                    <DialogContent>
                        <TextField name="title" label="Title" defaultValue={currentProject?.title} fullWidth margin="normal" required />
                        <TextField name="description" label="Description" defaultValue={currentProject?.description} fullWidth margin="normal" multiline rows={4} required />
                        <TextField name="technologies" label="Technologies (comma separated)" defaultValue={currentProject?.technologies?.join(', ')} fullWidth margin="normal" />
                        <TextField name="liveUrl" label="Live URL" defaultValue={currentProject?.liveUrl} fullWidth margin="normal" />
                        <TextField name="repoUrl" label="Repo URL" defaultValue={currentProject?.repoUrl} fullWidth margin="normal" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default ProjectsPage;
