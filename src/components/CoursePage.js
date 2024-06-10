import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, CircularProgress, Button, Box, TextField, InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';
import { fetchCourses, setPage } from '../slices/courseSlice';

const CoursePage = () => {
  const dispatch = useDispatch();
  const { courses = [], loading, totalPages, currentPage, limit } = useSelector(state => state.course);
  const [searchInput, setSearchInput] = useState(''); // For instant UI updates
  const [searchTerm, setSearchTerm] = useState(''); // For debounced API call

  useEffect(() => {
    dispatch(fetchCourses({ page: currentPage, limit, search: searchTerm }));
  }, [dispatch, currentPage, limit, searchTerm]);

  // Handle search input changes
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    setDebouncedSearchTerm(value);
    dispatch(setPage(1)); // Reset to first page on new search
  };

  // Debounced function to update the search term state
  const setDebouncedSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 500),
    []
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" gutterBottom sx={{ fontFamily: 'Playfair Display, serif' }}>
        Courses
      </Typography>
      
      {/* Search Bar */}
      <Box mb={3} display="flex" justifyContent="center">
        <TextField
          placeholder="Search Courses"
          value={searchInput}
          onChange={handleSearchChange}
          variant="outlined"
          sx={{
            width: '60%',
            borderColor: '#FFD700', // Gold color border
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#FFD700', // Gold color border
              },
              '&:hover fieldset': {
                borderColor: '#FFD700', // Gold color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFD700', // Gold color on focus
              },
            },
          }}
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
        {courses.length > 0 ? (
          courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '10px',
                  border: '1px solid #FFD700', // Gold color border
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
                  '&:hover': {
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Hover effect
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    align="center"
                    sx={{ fontFamily: 'Playfair Display, serif', color: '#003366' }} // Deep Blue color
                  >
                    <Link to={`/course/${course._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {course.Course_name}
                    </Link>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ width: '100%', marginTop: 2 }}>
            No courses found.
          </Typography>
        )}
      </Grid>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          sx={{ margin: '0 5px', backgroundColor: '#003366', color: '#FFFFFF', '&:hover': { backgroundColor: '#002244' } }}
        >
          Previous
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            variant={index + 1 === currentPage ? 'contained' : 'outlined'}
            onClick={() => handlePageChange(index + 1)}
            sx={{
              margin: '0 5px',
              backgroundColor: index + 1 === currentPage ? '#003366' : 'transparent',
              color: index + 1 === currentPage ? '#FFFFFF' : '#003366',
              borderColor: '#003366',
              '&:hover': {
                backgroundColor: index + 1 === currentPage ? '#002244' : 'rgba(0, 51, 102, 0.1)',
              },
            }}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="contained"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          sx={{ margin: '0 5px', backgroundColor: '#003366', color: '#FFFFFF', '&:hover': { backgroundColor: '#002244' } }}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default CoursePage;
