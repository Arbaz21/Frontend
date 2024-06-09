import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Avatar, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { fetchTeacherById, clearSelectedTeacher } from '../slices/teacherSlice';
import axios from 'axios';

const TeacherProfile = () => {
    const { teacherId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedTeacher = useSelector(state => state.teacher.selectedTeacher);
    const loading = useSelector(state => state.teacher.loading);
    const error = useSelector(state => state.teacher.error);

    useEffect(() => {
        dispatch(fetchTeacherById(teacherId));

        return () => {
            dispatch(clearSelectedTeacher()); // Clear selected teacher on unmount
        };
    }, [dispatch, teacherId]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!selectedTeacher) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography>No teacher data available</Typography>
            </Container>
        );
    }

    // Ensure CoursesTaught and CoursesTaughtIDs are arrays before mapping over them
    const courses = selectedTeacher["Courses Taught"] || [];
    const courseIDs = selectedTeacher.CoursesTaughtIDs || [];

    const handleDelete = async () => {
        try {
            await axios.delete('http://localhost:3001/api/teachers/deleteteacher', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                data: { objectId: selectedTeacher._id },
            });
            navigate('/teachers');
        } catch (error) {
            console.error("Error deleting teacher", error);
        }
    };

    return (
        <Container>
            <Paper sx={{ padding: 3 }}>
                <Avatar src={`data:image/jpeg;base64,${selectedTeacher.ImageFile}`} sx={{ width: 100, height: 100 }} />
                <Typography variant="h4">{selectedTeacher.Name}</Typography>
                <Typography variant="h6">{selectedTeacher.Title}</Typography>
                <Typography variant="body1">{selectedTeacher.Overview}</Typography>
                <Typography variant="body1">{`Department: ${selectedTeacher.Department}`}</Typography>
                <Typography variant="body1">{`Specialization: ${selectedTeacher.Specialization}`}</Typography>
                <Typography variant="body1">{`Onboard Status: ${selectedTeacher.OnboardStatus}`}</Typography>

                {/* Display Courses as Clickable Tiles */}
                <Typography variant="h5" sx={{ marginTop: 2 }}>Courses Taught:</Typography>
                {courses.length > 0 ? (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {courses.map((courseName, index) => (
                            <Grid item xs={12} sm={6} md={4} key={courseIDs[index]}>
                                <Card
                                    sx={{ 
                                        height: '100%', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        border: '2px solid maroon',
                                        borderRadius: '10px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/course/${courseIDs[index]}`)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" align="center">
                                            {courseName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography>No courses available.</Typography>
                )}

                <Button variant="contained" onClick={() => navigate(`/teachers/edit/${selectedTeacher._id}`)}>Edit</Button>
                <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
            </Paper>
        </Container>
    );
};

export default TeacherProfile;
