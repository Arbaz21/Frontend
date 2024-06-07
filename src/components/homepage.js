import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    IconButton,
    Divider,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Badge,
    Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [anonymous, setAnonymous] = useState(false); // Default value for anonymous

    useEffect(() => {
        fetchUser();
        fetchPosts();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/user', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/posts/getposts', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setPosts(response.data.reverse());
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts", error);
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            content: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            content: Yup.string().required('Content is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await axios.post('http://localhost:3001/api/posts/createpost', {
                    title: values.title,
                    content: values.content,
                    visibility: 'Public'
                }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                fetchPosts();
                resetForm();
            } catch (error) {
                console.error("Error creating post", error);
            }
        }
    });

    const handleDelete = async (postId) => {
        try {
            await axios.delete('http://localhost:3001/api/posts/deletepost', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                data: { postId }
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const handleVote = async (postId, type) => {
        try {
            await axios.post(`http://localhost:3001/api/posts/${type}post`, { postId }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchPosts();
        } catch (error) {
            console.error(`Error handling ${type} vote`, error);
        }
    };

    const handleComment = async (postId) => {
        try {
            await axios.post(`http://localhost:3001/api/comments/postCommentOnPost`, {
                post_id: postId,
                commentText: commentText,
                anonymous: anonymous
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCommentText(''); // Reset comment text after posting
            setAnonymous(false); // Reset anonymous after posting
            fetchPosts();
        } catch (error) {
            console.error(`Error commenting`, error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete('http://localhost:3001/api/comments/deletecomment', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                data: { objectId: commentId }
            });
            fetchPosts();
        } catch (error) {
            console.error("Error deleting comment", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{
            marginTop: '20px',
            backgroundImage: 'url("background.jpeg")',
            backgroundSize: 'cover',
            minHeight: '100vh',
            padding: '20px'
        }}>
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
                            <Button component={Link} to="/teachers" variant="contained" color="error" fullWidth sx={{ marginBottom: '10px' }}>Teachers</Button>
                            {/* Link to Profile page */}
                            <Button component={Link} to="/profile" variant="contained" color="error" fullWidth sx={{ marginBottom: '10px' }}>View Profile</Button>
                            {/* Link to Courses page */}
                            <Button component={Link} to="/courses" variant="contained" color="error" fullWidth sx={{ marginBottom: '10px' }}>Courses</Button>
                            <Button variant="contained" color="secondary" fullWidth>Logout</Button>
                        </Paper>
                    </Grid>
                    {/* Feed Section */}
                    <Grid item xs={12} md={9}>
                        {/* Post Form */}
                        <Paper elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                            <Typography variant="h5" gutterBottom>
                                What's on your mind?
                            </Typography>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    id="title"
                                    name="title"
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    margin="normal"
                                    sx={{ marginBottom: '20px' }}
                                />
                                <TextField
                                    id="content"
                                    name="content"
                                    label="Content"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={formik.values.content}
                                    onChange={formik.handleChange}
                                    error={formik.touched.content && Boolean(formik.errors.content)}
                                    helperText={formik.touched.content && formik.errors.content}
                                    margin="normal"
                                    sx={{ marginBottom: '20px' }}
                                />
                                <Button type="submit" variant="contained" color="error">
                                    Post
                                </Button>
                            </form>
                        </Paper>
                        {/* Display Posts */}
                        {posts.map(post => (
                            <Paper key={post._id} elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                                <Typography variant="h5" gutterBottom>
                                    <strong>{post.title}</strong>
                                </Typography>
                                <ListItem alignItems="flex-start">
                                    <Avatar alt={post.createdBy} src="/static/images/avatar/1.jpg" sx={{ marginRight: '10px' }} />
                                    <ListItemText
                                        primary={post.title}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    {post.content}
                                                </Typography>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    Posted by {post.createdBy} • {formatDate(post.createdAt)}
                                                </Typography>
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    {post.upvotes} upvotes • {post.downvotes} downvotes
                                                </Typography>
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="upvote" onClick={() => handleVote(post._id, 'upvote')}>
                                            <Badge badgeContent={post.upvotes} color="primary">
                                                <ThumbUpAltIcon />
                                            </Badge>
                                        </IconButton>
                                        <IconButton edge="end" aria-label="downvote" onClick={() => handleVote(post._id, 'downvote')}>
                                            <Badge badgeContent={post.downvotes} color="error">
                                                <ThumbDownAltIcon />
                                            </Badge>
                                        </IconButton>
                                        {user && user.role === 'admin' && (
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(post._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {/* Comment Form */}
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleComment(post._id);
                                }}>
                                    <TextField
                                        name="commentText"
                                        label="Add a comment"
                                        variant="outlined"
                                        fullWidth
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        margin="
                                        normal"
                                        sx={{ marginBottom: '20px' }}
                                    />
                                    <Button type="submit" variant="contained" color="error">
                                        Comment
                                    </Button>
                                    <Button
                                        onClick={() => setAnonymous(!anonymous)}
                                        size="small"
                                        color="error"
                                        sx={{ marginLeft: '5px' }}
                                    >
                                        {anonymous ? 'Post as Myself' : 'Post Anonymously'}
                                    </Button>
                                </form>
                                {/* Comment Section */}
                                {post.comments.map(comment => (
                                    <ListItem key={comment._id} alignItems="flex-start">
                                        <Avatar alt={comment.name} src="/static/images/avatar/1.jpg" />
                                        <ListItemText
                                            primary={comment.comment}
                                            secondary={
                                                <>
                                                    <Typography variant="caption" display="block" gutterBottom>
                                                        Comment by {comment.name} • {formatDate(comment.createdAt)}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        {user && (user.role === 'admin' || user.erp === comment.erp) && (
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        )}
                                    </ListItem>
                                ))}
                            </Paper>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;
