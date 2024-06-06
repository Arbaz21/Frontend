import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Avatar, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('/api/teachers/getallteachers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTeachers(response.data);
            } catch (error) {
                console.error("Error fetching teachers", error);
            }
        };

        fetchTeachers();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Teachers</Typography>
            <Grid container spacing={3}>
                {teachers.map((teacher) => (
                    <Grid item xs={12} md={6} key={teacher._id}>
                        <Paper sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar src={teacher.ImageFile} sx={{ marginRight: 2 }} />
                            <div>
                                <Typography variant="h6">{teacher.Name}</Typography>
                                <Typography variant="subtitle1">{teacher.Title}</Typography>
                                <Button variant="contained" onClick={() => navigate(`/teachers/${teacher._id}`)}>View Profile</Button>
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TeacherList;
