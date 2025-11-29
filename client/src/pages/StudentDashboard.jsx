import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import { Button, Typography, Box, Paper, TextField, Chip, Link, CircularProgress, Grid, Card, CardContent, CardActions } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LockIcon from '@mui/icons-material/Lock';
import CancelIcon from '@mui/icons-material/Cancel';


const weekData = [
    { week: 1, title: 'Week 1: Foundational Project', description: 'Build a project with basic concepts to solidify your understanding.' },
    { week: 2, title: 'Week 2: Intermediate Challenge', description: 'Tackle a more complex individual project to hone your skills.' },
    { week: 3, title: 'Week 3: Collaborative Project Pt. 1', description: 'Begin working in a team on a large-scale project.' },
    { week: 4, title: 'Week 4: Collaborative Project Pt. 2', description: 'Complete and present your team project.' },
];

const StudentDashboard = () => {
    const { user } = useUser();
    const [submissions, setSubmissions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [repoUrl, setRepoUrl] = useState('');
    const [activeWeek, setActiveWeek] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();



// ... (rest of the component)

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    const [submissionsResponse, projectsResponse] = await Promise.all([
                        fetch('http://localhost:8000/api/submissions', {
                            headers: { 'Authorization': `Bearer ${idToken}` }
                        }),
                        fetch('http://localhost:8000/api/projects', {
                            headers: { 'Authorization': `Bearer ${idToken}` }
                        })
                    ]);
                    const submissionsData = await submissionsResponse.json();
                    const projectsData = await projectsResponse.json();
                    console.log('Submissions Data:', submissionsData);
                    console.log('Projects Data:', projectsData);
                    setSubmissions(submissionsData);
                    setProjects(projectsData);

                    const approvedWeeks = submissionsData.filter(s => s.status === 'approved').map(s => s.week);
                    const latestApprovedWeek = approvedWeeks.length > 0 ? Math.max(...approvedWeeks) : 0;
                    setActiveWeek(latestApprovedWeek + 1);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleSubmission = async (e, week) => {
        e.preventDefault();
        try {
            const idToken = await auth.currentUser.getIdToken();
            await fetch('http://localhost:8000/api/submissions/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}`},
                body: JSON.stringify({ week, repoUrl })
            });

            // Re-fetch submissions to update UI
            const response = await fetch('http://localhost:8000/api/submissions', { headers: { 'Authorization': `Bearer ${idToken}` } });
            setSubmissions(await response.json());
            setRepoUrl('');
        } catch (error) {
            console.error('Error submitting project:', error);
        }
    };
    
    const getStatusInfo = (status) => {
        switch (status) {
            case 'approved': return { icon: <CheckCircleIcon color="success" />, color: 'success', label: 'Approved' };
            case 'rejected': return { icon: <CancelIcon color="error" />, color: 'error', label: 'Rejected' };
            case 'pending': return { icon: <HourglassEmptyIcon color="warning" />, color: 'warning', label: 'Pending Review' };
            default: return { icon: <LockIcon color="disabled"/>, color: 'default', label: 'Locked' };
        }
    };

    const WeekCard = ({ weekInfo }) => {
        const { week, title, description } = weekInfo;
        const submission = submissions.find(s => s.week === week);
        const isCurrentWeek = week === activeWeek;
        const isLocked = week > activeWeek;
        const statusInfo = submission ? getStatusInfo(submission.status) : getStatusInfo(null);

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: week * 0.1 }}>
                <Card sx={{ opacity: isLocked ? 0.5 : 1, pointerEvents: isLocked ? 'none' : 'auto', borderRadius: 2, border: `1px solid ${isCurrentWeek ? '#6a1b9a' : 'rgba(0, 0, 0, 0.12)'}` }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ flexGrow: 1 }}>{title}</Typography>
                            <Chip icon={statusInfo.icon} label={statusInfo.label} color={statusInfo.color} variant="outlined" />
                        </Box>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>
                        
                        {submission && (
                            <Box>
                                <Typography variant="body2">Submitted on: {new Date(submission.submittedAt.seconds * 1000).toLocaleDateString()}</Typography>
                                <Link href={submission.repoUrl} target="_blank" rel="noopener noreferrer">View Submission</Link>
                                {submission.feedback && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2">Feedback:</Typography>
                                        <Typography variant="body2" color="text.secondary">{submission.feedback}</Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </CardContent>

                    {isCurrentWeek && !submission && (
                         <CardActions>
                            <Box component="form" onSubmit={(e) => handleSubmission(e, week)} sx={{ width: '100%', p: 2 }}>
                                <TextField
                                    label="GitHub Repository URL"
                                    variant="outlined"
                                    fullWidth
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    required
                                    sx={{ mb: 2 }}
                                />
                                <Button type="submit" variant="contained">Submit Week {week}</Button>
                            </Box>
                         </CardActions>
                    )}
                </Card>
            </motion.div>
        )
    }

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    
    const completedAllWeeks = activeWeek > 4;
    const progress = (activeWeek - 1) * 25;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Typography variant="h4" gutterBottom>Welcome, {user?.name || 'Student'}</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant="determinate" value={progress} size={80} thickness={4} />
                            <Box
                                sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                }}
                            >
                                <Typography variant="caption" component="div" color="text.secondary">
                                {`${Math.round(progress)}%`}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>Internship Progress</Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {weekData.map(week => (
                            <Grid item xs={12} key={week.week}>
                                <WeekCard weekInfo={week} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>My Projects</Typography>
                    {projects.length > 0 ? (
                        projects.map(project => (
                            <Card key={project.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{project.title}</Typography>
                                    <Typography color="text.secondary">{project.description}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No projects yet. Add one from the projects page.</Typography>
                    )}
                </Grid>
            </Grid>

            {completedAllWeeks && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                    <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center', borderRadius: 2, background: 'linear-gradient(45deg, #6a1b9a 30%, #ff6f00 90%)' }}>
                        <Typography variant="h4" fontWeight="bold" color="white">Congratulations!</Typography>
                        <Typography color="white" sx={{ my: 2 }}>You have completed all 4 weeks of the internship.</Typography>
                        <Button variant="contained" sx={{bgcolor: 'white', color: 'primary.main', '&:hover': {bgcolor: '#eee'}}} onClick={() => navigate('/payment')}>
                            Claim Your Certificate Now
                        </Button>
                    </Paper>
                </motion.div>
            )}
        </motion.div>
    );
};

export default StudentDashboard;
