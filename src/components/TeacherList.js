import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Avatar, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTeachers = async (page) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                return;
            }

            console.log("Using token:", token);

            const response = await axios.get(`http://localhost:3001/api/teachers/getallteachers?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log("Fetched Teachers: ", response.data);
            setTeachers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching teachers", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers(currentPage);
    }, [currentPage]);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Teachers</Typography>
            <Grid container spacing={3}>
                {teachers.map((teacher) => (
                    <Grid item xs={12} md={6} key={teacher._id}>
                        <Paper sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                            <Avatar src={`data:image/jpeg;base64,${teacher.ImageFile}`} sx={{ marginRight: 2 }} />
                            <div>
                                <Typography variant="h6">{teacher.Name}</Typography>
                                <Typography variant="subtitle1">{teacher.Title}</Typography>
                                <Button variant="contained" onClick={() => navigate(`/teachers/${teacher._id}`)}>View Profile</Button>
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <Button onClick={prevPage} disabled={currentPage === 1} style={{ marginRight: '10px' }}>Previous Page</Button>
                <Button onClick={nextPage}>Next Page</Button>
            </div>
        </Container>
    );
};

export default TeacherList;
