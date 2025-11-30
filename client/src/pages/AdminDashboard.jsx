import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import { Box, Typography, Paper, Grid, Select, MenuItem, CircularProgress, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { BASE_URL } from '../utils/api';

const AdminDashboard = () => {
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                setLoading(true);
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    const [usersResponse, submissionsResponse] = await Promise.all([
                        fetch(`${BASE_URL}/admin/users`, {
                            headers: { 'Authorization': `Bearer ${idToken}` }
                        }),
                        fetch(`${BASE_URL}/admin/recent-submissions`, {
                            headers: { 'Authorization': `Bearer ${idToken}` }
                        })
                    ]);
                    const usersData = await usersResponse.json();
                    const submissionsData = await submissionsResponse.json();
                    setUsers(usersData);
                    setRecentSubmissions(submissionsData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    const handleRoleChange = async (uid, newRole) => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            await fetch(`${BASE_URL}/admin/user-role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ uid, role: newRole })
            });
            // Update local state to reflect the change
            setUsers(prevUsers => prevUsers.map(u => u.uid === uid ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <motion.div initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
            <Card sx={{ backgroundColor: color, color: 'white', display: 'flex', alignItems: 'center', p: 2 }}>
                {icon}
                <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" component="div">{value}</Typography>
                    <Typography variant="body2">{title}</Typography>
                </Box>
            </Card>
        </motion.div>
    );

    const totalUsers = users.length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalEvaluators = users.filter(u => u.role === 'evaluator').length;

    const columns = [
        { field: 'displayName', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            renderCell: (params) => (
                <Select
                    value={params.value || 'student'}
                    onChange={(e) => handleRoleChange(params.id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="evaluator">Evaluator</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>
            )
        }
    ];

    return (
        <div>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}><StatCard title="Total Users" value={totalUsers} icon={<PeopleIcon sx={{ fontSize: 40 }} />} color="primary.main" /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Students" value={totalStudents} icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="secondary.main" /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Evaluators" value={totalEvaluators} icon={<WorkIcon sx={{ fontSize: 40 }} />} color="success.main" /></Grid>
            </Grid>
            
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>User Management</Typography>
                    {loading ? <CircularProgress /> : (
                        <Paper sx={{ height: 400, width: '100%', borderRadius: 2 }}>
                            <DataGrid
                                rows={users}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                getRowId={(row) => row.uid}
                            />
                        </Paper>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>Recent Submissions</Typography>
                    {loading ? <CircularProgress /> : (
                        recentSubmissions.map(submission => (
                            <Card key={`${submission.studentId}-${submission.week}`} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{submission.studentName}</Typography>
                                    <Typography color="text.secondary">Week {submission.week}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default AdminDashboard;
