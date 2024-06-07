import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Grid, Paper, Avatar, Button, Box, TextField, InputAdornment } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState(''); // For instant UI updates
    const [searchTerm, setSearchTerm] = useState(''); // For debounced API call
    const navigate = useNavigate();

    // Fetch teachers with debouncing
    const fetchTeachers = useCallback(debounce(async (page, search) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No token found");
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:3001/api/teachers/getallteachers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    page,
                    limit: 10,
                    search,
                },
            });

            const { teachers, currentPage, totalPages } = response.data;

            setTeachers(teachers);
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching teachers", error);
            setLoading(false);
        }
    }, 500), []); // 500ms debounce delay

    // Use useEffect to trigger the fetch when searchTerm or currentPage changes
    useEffect(() => {
        fetchTeachers(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchTeachers]);

    // Update search term with debouncing
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchInput(value);
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "contained" : "outlined"}
                    onClick={() => handlePageChange(i)}
                    sx={{ margin: '0 5px' }}
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Teachers</Typography>
            <Box mb={3} display="flex" justifyContent="center">
                <TextField
                    placeholder="Search Teachers"
                    value={searchInput}
                    onChange={handleSearchChange}
                    variant="outlined"
                    sx={{ width: '60%' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
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
            <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                {renderPagination()}
            </Box>
        </Container>
    );
};

export default TeacherList;
