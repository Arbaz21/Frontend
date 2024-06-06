import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography, Button, IconButton, Divider, TextField } from '@mui/material'; // Import TextField
import MenuIcon from '@mui/icons-material/Menu';

const HomePage = () => {
    // Dummy data for recent posts
    const recentPosts = [
        { id: 1, content: 'faculty review ka kya scene hai', author: 'Fazul ur Rehman', timestamp: '2 hours ago' },
        { id: 2, content: 'Sir Sami ne A dediya is project ke liye? yess', author: 'Arbaz Asif', timestamp: '4 hours ago' },
        { id: 3, content: 'Zohaib bhai need help!', author: 'Zohaib', timestamp: '6 hours ago' },
    ];

    // Function to handle post submission
    const handleSubmit = (values) => {
        // Handle post submission logic here
        console.log(values);
    };

    return (
        <Box sx={{ marginTop: '20px' }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <IconButton>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" gutterBottom>
                                Sidebar
                            </Typography>
                            <Divider sx={{ marginBottom: '20px' }} />
                            {/* Link to Teachers page */}
                            <Button component={Link} to="/teachers" variant="contained" color="primary" fullWidth sx={{ marginBottom: '10px' }}>Teachers</Button>
                            {/* Link to Profile page */}
                            <Button component={Link} to="/profile" variant="contained" color="primary" fullWidth sx={{ marginBottom: '10px' }}>View Profile</Button>
                            {/* Link to Courses page */}
                            <Button component={Link} to="/courses" variant="contained" color="primary" fullWidth sx={{ marginBottom: '10px' }}>Courses</Button>
                            <Button variant="contained" color="secondary" fullWidth>Logout</Button>
                        </Paper>
                    </Grid>
                    {/* Feed Section */}
                    <Grid item xs={12} md={9}>
                        <Paper elevation={3} sx={{ padding: '20px' }}>
                            {/* Post Form */}
                            <Typography variant="h5" gutterBottom>
                                Create a New Post
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    name="postContent"
                                    label="What's on your mind?"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    margin="normal"
                                    sx={{ marginBottom: '20px' }}
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Post
                                </Button>
                            </form>
                            {/* Recent Posts */}
                            <Typography variant="h5" gutterBottom sx={{ marginTop: '40px' }}>
                                Recent Posts
                            </Typography>
                            {/* Render recent posts */}
                            {recentPosts.map(post => (
                                <Paper key={post.id} sx={{ padding: '15px', marginTop: '15px' }}>
                                    <Typography variant="body1">{post.content}</Typography>
                                    <Typography variant="subtitle2" sx={{ marginTop: '10px', textAlign: 'right', color: 'gray' }}>
                                        Posted by {post.author} • {post.timestamp}
                                    </Typography>
                                </Paper>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default HomePage;
