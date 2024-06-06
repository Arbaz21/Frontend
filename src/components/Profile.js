import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Avatar, Paper, Button, Snackbar, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [userImage, setUserImage] = useState("/arbaz.jpg");
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        erpId: '',
        program: '',
        semester: '',
    });

    useEffect(() => {
        // Fetch profile data from an API or localStorage (mocked here for testing)
        const mockProfileData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            erpId: '123456',
            program: 'Computer Science',
            semester: 'Spring 2022',
        };
        setProfileData(mockProfileData);
    }, []);

    const handleProfileSubmit = (values) => {
        // Mock API call to update profile data
        setProfileData(values);
        setOpenSnackbar(true);
        setSnackbarMessage("Profile updated successfully");
        setIsEditing(false);
    };

    const handlePasswordSubmit = async (values, { resetForm }) => {
        try {
            // Replace with your actual API endpoint
            const response = await axios.patch('/changepassword', values, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming the token is stored in localStorage
                },
            });
            setOpenSnackbar(true);
            setSnackbarMessage(response.data.msg);
            setOpenPasswordDialog(false);
            resetForm();
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMessage(error.response?.data?.msg || "Error changing password");
        }
    };

    const profileValidationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        erpId: Yup.string().required('ERP ID is required'),
        program: Yup.string().required('Program is required'),
        semester: Yup.string().required('Semester is required'),
    });

    const passwordValidationSchema = Yup.object().shape({
        oldpassword: Yup.string().required('Old Password is required'),
        newpassword: Yup.string()
            .required('New Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number'),
    });

    return (
        <Container maxWidth="md">
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
            <Paper sx={{ padding: 3, marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>
                <Formik
                    initialValues={profileData}
                    validationSchema={profileValidationSchema}
                    onSubmit={handleProfileSubmit}
                    enableReinitialize
                >
                    {({ values, errors, touched, handleChange }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Avatar sx={{ width: 100, height: 100, margin: 'auto' }}>
                                        <img src={userImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </Avatar>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="firstName"
                                        label="First Name"
                                        disabled={!isEditing}
                                        fullWidth
                                        value={values.firstName}
                                        onChange={handleChange}
                                        error={touched.firstName && Boolean(errors.firstName)}
                                        helperText={touched.firstName && errors.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="lastName"
                                        label="Last Name"
                                        disabled={!isEditing}
                                        fullWidth
                                        value={values.lastName}
                                        onChange={handleChange}
                                        error={touched.lastName && Boolean(errors.lastName)}
                                        helperText={touched.lastName && errors.lastName}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="email"
                                        label="IBA Email"
                                        disabled={!isEditing}
                                        fullWidth
                                        value={values.email}
                                        onChange={handleChange}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="erpId"
                                        label="ERP ID"
                                        disabled={!isEditing}
                                        fullWidth
                                        value={values.erpId}
                                        onChange={handleChange}
                                        error={touched.erpId && Boolean(errors.erpId)}
                                        helperText={touched.erpId && errors.erpId}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="program"
                                        label="Program"
                                        disabled={!isEditing}
                                        fullWidth
                                        value={values.program}
                                        onChange={handleChange}
                                        error={touched.program && Boolean(errors.program)}
                                        helperText={touched.program && errors.program}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="semester"
                                        label="Semester"
                                        disabled={!isEditing}
                                        fullWidth
                                        value={values.semester}
                                        onChange={handleChange}
                                        error={touched.semester && Boolean(errors.semester)}
                                        helperText={touched.semester && errors.semester}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {isEditing ? (
                                        <Button type="submit" variant="contained" color="primary">
                                            Save
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                                                Edit Profile
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => setOpenPasswordDialog(true)} sx={{ marginLeft: 2 }}>
                                                Change Password
                                            </Button>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>

            <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
                <DialogTitle>Change Password</DialogTitle>
                <Formik
                    initialValues={{ oldpassword: '', newpassword: '' }}
                    validationSchema={passwordValidationSchema}
                    onSubmit={handlePasswordSubmit}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <DialogContent>
                                <Field
                                    as={TextField}
                                    name="oldpassword"
                                    label="Old Password"
                                    type="password"
                                    fullWidth
                                    margin="dense"
                                    error={touched.oldpassword && Boolean(errors.oldpassword)}
                                    helperText={touched.oldpassword && errors.oldpassword}
                                />
                                <Field
                                    as={TextField}
                                    name="newpassword"
                                    label="New Password"
                                    type="password"
                                    fullWidth
                                    margin="dense"
                                    error={touched.newpassword && Boolean(errors.newpassword)}
                                    helperText={touched.newpassword && errors.newpassword}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenPasswordDialog(false)} color="primary">
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary">
                                    Change Password
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </Container>
    );
};

export default Profile;
