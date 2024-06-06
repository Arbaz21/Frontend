// src/components/AuthPage.js
import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert, Box, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    erp: Yup.string().required('Required'),
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
});

const AuthPage = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            erp: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setError(null);
            try {
                const response = await axios.post('http://localhost:3001/api/users/register', {
                    email: values.email,
                    password: values.password,
                    firstname: values.firstName,
                    lastname: values.lastName,
                    erp: values.erp,
                });
                alert(response.data.msg);
                navigate('/login');
            } catch (error) {
                console.error('Error during registration:', error);
                setError(error.response?.data?.msg || 'Registration failed. Please try again.');
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
                                Sign Up
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
                                    name="erp"
                                    label="ERP ID"
                                    variant="outlined"
                                    value={formik.values.erp}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.erp && Boolean(formik.errors.erp)}
                                    helperText={formik.touched.erp && formik.errors.erp}
                                />
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    variant="outlined"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
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
                                <TextField
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                                <Button type="submit" variant="contained" color="primary">Sign Up</Button>
                            </form>
                            <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '16px' }}>
                                Already Signed Up? <a href="/login">Login</a>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AuthPage;
