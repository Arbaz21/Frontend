import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Container, Typography, Paper, CircularProgress, MenuItem, Select, InputLabel, FormControl, Grid, Alert } from '@mui/material';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .required('Required'),
  firstname: Yup.string().required('Required'),
  lastname: Yup.string().required('Required'),
  erp: Yup.number().required('Required').typeError('ERP must be a number').integer('ERP must be an integer'),
  role: Yup.string().oneOf(['Admin', 'User'], 'Invalid role').required('Required'),
});

const Auth = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('/background.jpeg')`, // Update with your image URL
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper elevation={10} sx={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                Sign Up
              </Typography>
              <Formik
                initialValues={{ email: '', password: '', firstname: '', lastname: '', erp: '', role: 'User' }}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  try {
                    const response = await axios.post('http://localhost:3001/api/users/register', values);
                    alert(response.data.msg);
                    setSubmitting(false);
                    navigate('/login'); // Navigate to login page on successful registration
                  } catch (error) {
                    console.error('Error:', error.response?.data || error.message);
                    const apiError = error.response?.data?.msg || 'An unexpected error occurred. Please try again.';
                    setErrors({ apiError });
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, errors, touched, handleChange, values }) => (
                  <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {errors.apiError && (
                      <Alert severity="error">{errors.apiError}</Alert>
                    )}
                    <TextField
                      name="firstname"
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleChange}
                      error={touched.firstname && !!errors.firstname}
                      helperText={<ErrorMessage name="firstname" />}
                    />
                    <TextField
                      name="lastname"
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      value={values.lastname}
                      onChange={handleChange}
                      onBlur={handleChange}
                      error={touched.lastname && !!errors.lastname}
                      helperText={<ErrorMessage name="lastname" />}
                    />
                    <TextField
                      name="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleChange}
                      error={touched.email && !!errors.email}
                      helperText={<ErrorMessage name="email" />}
                    />
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleChange}
                      error={touched.password && !!errors.password}
                      helperText={<ErrorMessage name="password" />}
                    />
                    <TextField
                      name="erp"
                      label="ERP"
                      variant="outlined"
                      fullWidth
                      value={values.erp}
                      onChange={handleChange}
                      onBlur={handleChange}
                      error={touched.erp && !!errors.erp}
                      helperText={<ErrorMessage name="erp" />}
                    />
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        name="role"
                        value={values.role}
                        onChange={handleChange}
                        error={touched.role && !!errors.role}
                      >
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                      </Select>
                      <ErrorMessage name="role" component={Typography} color="error" />
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>
                  </Form>
                )}
              </Formik>
              <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '16px' }}>
                Already Signed Up? <a href="/login">Login</a>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Auth;
