import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Avatar, Button } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TeacherProfile = () => {
    const { teacherId } = useParams();
    const [teacher, setTeacher] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/teachers/${teacherId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setTeacher(response.data);
            } catch (error) {
                console.error("Error fetching teacher", error);
            }
        };

        fetchTeacher();
    }, [teacherId]);

    if (!teacher) {
        return <Typography>Loading...</Typography>;
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/teachers/${teacherId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                data: { objectId: teacher._id },
            });
            navigate('/teachers');
        } catch (error) {
            console.error("Error deleting teacher", error);
        }
    };

    return (
        <Container>
            <Paper sx={{ padding: 3 }}>
                <Avatar src={`data:image/jpeg;base64,${teacher.ImageFile}`} sx={{ width: 100, height: 100 }} />
                <Typography variant="h4">{teacher.Name}</Typography>
                <Typography variant="h6">{teacher.Title}</Typography>
                <Typography variant="body1">{teacher.Overview}</Typography>
                <Typography variant="body1">{`Department: ${teacher.Department}`}</Typography>
                <Typography variant="body1">{`Specialization: ${teacher.Specialization}`}</Typography>
                <Typography variant="body1">{`Onboard Status: ${teacher.OnboardStatus}`}</Typography>
                <Button variant="contained" onClick={() => navigate(`/teachers/edit/${teacher._id}`)}>Edit</Button>
                <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
            </Paper>
        </Container>
    );
};

export default TeacherProfile;
