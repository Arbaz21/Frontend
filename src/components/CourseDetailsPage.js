// src/pages/CourseDetailsPage.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Grid, Paper, Avatar, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseDetails } from '../slices/courseSlice';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { courseDetails, loading } = useSelector(state => state.course);

  useEffect(() => {
    dispatch(fetchCourseDetails(courseId));
  }, [dispatch, courseId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!courseDetails) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" mt={5}>Course not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center" mt={5} mb={3}>{courseDetails.Course_name}</Typography>
      <Typography variant="body1" align="center">{courseDetails["Course Description"]}</Typography>

      {/* Render Teachers Section */}
      <Typography variant="h4" align="center" mt={5} mb={3}>Teachers</Typography>
      <Grid container spacing={3}>
        {courseDetails.Teachers.map((teacher) => (
          <Grid item xs={12} md={6} key={teacher._id}>
            <Paper sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar src={`data:image/jpeg;base64,${teacher.ImageFile}`} sx={{ marginRight: 2 }} />
              <div>
                <Typography variant="h6">{teacher.Name}</Typography>
                <Typography variant="subtitle1">{teacher.Title}</Typography>
                <Button variant="contained" onClick={() => window.location.href = `/teachers/${teacher._id}`}>View Profile</Button>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CourseDetailsPage;
