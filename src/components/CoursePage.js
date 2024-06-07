import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Avatar,
    TextField,
    Button
} from '@mui/material';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCourseData, setNewCourseData] = useState({
        title: '',
        description: '',
        teachers: []
    });
    const [teachersForNewCourse, setTeachersForNewCourse] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

    useEffect(() => {
        fetchAllCourses();
    }, []);

    const fetchAllCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/courses/getallcourses');
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching courses", error);
            setLoading(false);
        }
    };

    const fetchTeachersForNewCourse = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/courses/getallteachers');
            setTeachersForNewCourse(response.data);
        } catch (error) {
            console.error("Error fetching teachers for new course", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourseData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleTeacherChange = (e) => {
        const selectedTeacherIds = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedTeachers(selectedTeacherIds);
    };

    const handleCreateCourse = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/courses/', {
                title: newCourseData.title,
                description: newCourseData.description,
                teachers: selectedTeachers
            });
            setCourses(prevCourses => [...prevCourses, response.data.course]);
            setNewCourseData({
                title: '',
                description: '',
                teachers: []
            });
            setSelectedTeachers([]);
        } catch (error) {
            console.error("Error creating course", error);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{
            marginTop: '20px',
            padding: '20px'
        }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                    <Typography variant="h5" gutterBottom>
                        Create a New Course
                    </Typography>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateCourse();
                    }}>
                        <TextField
                            name="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={newCourseData.title}
                            onChange={handleInputChange}
                            margin="normal"
                            sx={{ marginBottom: '20px' }}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            variant="outlined"
                            fullWidth
                            value={newCourseData.description}
                            onChange={handleInputChange}
                            margin="normal"
                            sx={{ marginBottom: '20px' }}
                        />
                        <TextField
                            select
                            name="teachers"
                            label="Teachers"
                            variant="outlined"
                            fullWidth
                            value={selectedTeachers}
                            onChange={handleTeacherChange}
                            SelectProps={{
                                multiple: true,
                            }}
                            margin="normal"
                            sx={{ marginBottom: '20px' }}
                        >
                            {teachersForNewCourse.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </TextField>
                        <Button type="submit" variant="contained" color="primary">
                            Create Course
                        </Button>
                    </form>
                </Paper>
                <Typography variant="h5" gutterBottom>
                    All Courses
                </Typography>
                <List>
                    {courses.map(course => (
                        <Paper key={course._id} elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={course.title}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="textPrimary">
                                                {course.description}
                                            </Typography>
                                            <Typography variant="caption" display="block" gutterBottom>
                                                Teachers:
                                                {course.teachers.map((teacher, index) => (
                                                    <span key={index}>{teacher}, </span>
                                                ))}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            </Container>
        </Box>
    );
};

export default CoursesPage;
