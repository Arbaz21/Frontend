import React, { useEffect, useState, useCallback } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Button, Box, TextField, InputAdornment } from '@mui/material';
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
    console.log(`Fetching courses with search term: "${searchTerm}"`); // Log to verify
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
      <Typography variant="h2" align="center" gutterBottom>Courses</Typography>
      
      {/* Search Bar */}
      <Box mb={3} display="flex" justifyContent="center">
        <TextField
          placeholder="Search Courses"
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
        {courses.map(course => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '2px solid maroon', borderRadius: '10px' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" align="center">
                  <Link to={`/course/${course._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Button fullWidth variant="text">
                      <b>{course.Course_name}</b>
                    </Button>
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          sx={{ margin: '0 5px' }}
        >
          Previous
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            variant={index + 1 === currentPage ? 'contained' : 'outlined'}
            onClick={() => handlePageChange(index + 1)}
            sx={{ margin: '0 5px' }}
          >
            {index + 1}
          </Button>
        ))}
        <Button 
          variant="contained" 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          sx={{ margin: '0 5px' }}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default CoursePage;
