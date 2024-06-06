import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert, Box, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
});

const LoginPage = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setError(null);
            try {
                // Make a POST request to your backend API
                const response = await axios.post('http://localhost:3001/api/users/login', {
                    loginUsername: values.email, // Use email as loginUsername
                    password: values.password,
                });

                // Handle response
                alert(response.data.msg); // Display success message
                localStorage.setItem('token', response.data.token); // Store the token in localStorage
                navigate('/home'); // Redirect to home page upon successful login
            } catch (error) {
                console.error('Error during login:', error);
                setError(error.response?.data?.msg || 'Login failed. Please try again.');
            }
        },
    });

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url('/background.jpeg')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={10} sx={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                                Login
                            </Typography>
                            {error && <Alert severity="error">{error}</Alert>}
                            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                                <TextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                                <Button type="submit" variant="contained" color="primary">Login</Button>
                            </form>
                            <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '16px' }}>
                                New User? <a href="/">Sign Up</a>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default LoginPage;
