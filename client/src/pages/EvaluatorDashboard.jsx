import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import { Box, Typography, Paper, Link, Button, Grid, Chip, Tabs, Tab, CircularProgress, Card, CardContent, CardActions, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import { BASE_URL } from '../utils/api';

const EvaluatorDashboard = () => {
    const { user } = useUser();
    const [submissions, setSubmissions] = useState([]);
    const [studentProjects, setStudentProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('pending');
    const [open, setOpen] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                setLoading(true);
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    const [submissionsResponse, projectsResponse] = await Promise.all([
                        fetch(`${BASE_URL}/evaluator/all-submissions`, {
                            headers: { 'Authorization': `Bearer ${idToken}` }
                        }),
                        fetch(`${BASE_URL}/evaluator/student-projects`, {
                            headers: { 'Authorization': `Bearer ${idToken}` }
                        })
                    ]);
                    const submissionsData = await submissionsResponse.json();
                    const projectsData = await projectsResponse.json();
                    setSubmissions(submissionsData);
                    setStudentProjects(projectsData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    const handleUpdateStatus = async (studentId, week, status) => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            await fetch(`${BASE_URL}/evaluator/submission`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ studentId, week, status })
            });
            // Refresh submissions by filtering out the updated one and adding it to the new list
            setSubmissions(prev => prev.map(s => s.studentId === studentId && s.week === week ? {...s, status} : s));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleOpen = (submission) => {
        setCurrentSubmission(submission);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentSubmission(null);
    };

    const handleAddFeedback = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const feedback = formData.get('feedback');

        try {
            const idToken = await auth.currentUser.getIdToken();
            await fetch(`${BASE_URL}/evaluator/submission/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    studentId: currentSubmission.studentId,
                    week: currentSubmission.week,
                    feedback
                })
            });
            setSubmissions(prev => prev.map(s => s.studentId === currentSubmission.studentId && s.week === currentSubmission.week ? {...s, feedback} : s));
            handleClose();
        } catch (error) {
            console.error('Error adding feedback:', error);
        }
    };
    
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };
    
    const filteredSubmissions = submissions.filter(s => s.status === tab);

    const SubmissionCard = ({ submission }) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1">{submission.studentName || 'Unknown Student'}</Typography>
                            <Typography variant="body2" color="text.secondary">{submission.studentEmail}</Typography>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Chip label={`Week ${submission.week}`} />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Link href={submission.repoUrl} target="_blank" rel="noopener noreferrer">View Repository</Link>
                        </Grid>
                    </Grid>
                    {submission.feedback && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Feedback:</Typography>
                            <Typography variant="body2" color="text.secondary">{submission.feedback}</Typography>
                        </Box>
                    )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    {submission.status === 'pending' && (
                        <>
                            <Button size="small" variant="contained" color="success" onClick={() => handleUpdateStatus(submission.studentId, submission.week, 'approved')} sx={{mr: 1}}>Approve</Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateStatus(submission.studentId, submission.week, 'rejected')}>Reject</Button>
                        </>
                    )}
                    <Button size="small" onClick={() => handleOpen(submission)}>Add Feedback</Button>
                </CardActions>
            </Card>
        </motion.div>
    );

    const ProjectCard = ({ project }) => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h5">{project.title}</Typography>
                    <Typography color="text.secondary">{project.description}</Typography>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <div>
            <Typography variant="h4" gutterBottom>Evaluator Dashboard</Typography>
            <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tab} onChange={handleTabChange} aria-label="submission status tabs">
                    <Tab label="Pending" value="pending" />
                    <Tab label="Approved" value="approved" />
                    <Tab label="Rejected" value="rejected" />
                    <Tab label="Student Projects" value="student-projects" />
                </Tabs>
            </Box>
            
            {loading ? <CircularProgress /> : (
                <motion.div>
                    {tab === 'student-projects' ? (
                        studentProjects.length > 0 ? (
                            studentProjects.map(project => <ProjectCard key={project.id} project={project} />)
                        ) : (
                            <Typography sx={{mt: 4, textAlign: 'center'}}>No student projects found.</Typography>
                        )
                    ) : (
                        filteredSubmissions.length > 0 ? (
                            filteredSubmissions.map(sub => <SubmissionCard key={`${sub.studentId}-${sub.week}`} submission={sub} />)
                        ) : (
                            <Typography sx={{mt: 4, textAlign: 'center'}}>No {tab} submissions.</Typography>
                        )
                    )}
                </motion.div>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Feedback to {currentSubmission?.studentName}'s Week {currentSubmission?.week} Submission</DialogTitle>
                <form onSubmit={handleAddFeedback}>
                    <DialogContent>
                        <TextField name="feedback" label="Feedback" fullWidth margin="normal" multiline rows={4} required />
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

export default EvaluatorDashboard;
