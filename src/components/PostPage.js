import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Avatar,
    TextField,
    Button,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DeleteIcon from '@mui/icons-material/Delete';

const PostPage = () => {
    const [post, setPost] = useState({ comments: [] }); // Default empty comments array
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const { postId } = useParams();
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve user from localStorage

    useEffect(() => {
        fetchPost();
    }, []);

    // Fetch post details and comments
    const fetchPost = async () => {
        try {
            const postResponse = await axios.post(
                `http://localhost:3001/api/posts/getpostbyid`, 
                { postId },
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );

            // Ensure that comments have valid dates
            const postData = postResponse.data;
            postData.comments = postData.comments.map(comment => ({
                ...comment,
                createdAt: comment.createdAt || new Date().toISOString()
            }));

            setPost(postData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching post", error);
            setLoading(false);
        }
    };

    // Handle upvote or downvote
    const handleVote = async (type) => {
        try {
            await axios.post(`http://localhost:3001/api/posts/${type}post`, { postId }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchPost(); // Refresh the post details after voting
        } catch (error) {
            console.error(`Error handling ${type} vote`, error);
        }
    };

    // Handle adding a new comment
    const handleComment = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/api/comments/postCommentOnPost`, {
                post_id: postId,
                commentText,
                anonymous
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            const newComment = {
                _id: response.data.commentId,
                comment: commentText,
                anonymous,
                name: anonymous ? 'Anonymous' : `${user.firstname} ${user.lastname}`,
                createdAt: new Date().toISOString() // Set the createdAt field with the current date-time
            };
            
            setPost(prevPost => ({ ...prevPost, comments: [newComment, ...prevPost.comments] }));
            setCommentText('');
            setAnonymous(false);
        } catch (error) {
            console.error(`Error commenting`, error);
        }
    };

    // Handle deleting a comment
    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete('http://localhost:3001/api/comments/deletecomment', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                data: { objectId: commentId }
            });
            fetchPost(); // Refresh the post details after deleting a comment
        } catch (error) {
            console.error("Error deleting comment", error);
        }
    };

    // Format the date to a readable string
    const formatDate = (dateString) => {
        if (!dateString) return 'No Date Provided';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    // Loading state while fetching data
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ marginTop: '20px', padding: '20px' }}>
            <Container maxWidth="lg">
                {/* Display Post */}
                {post && (
                    <Paper elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                        <Typography variant="h5" gutterBottom>
                            <strong>{post.title}</strong>
                        </Typography>
                        <List>
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
                                    <IconButton edge="end" aria-label="upvote" onClick={() => handleVote('upvote')}>
                                        <ThumbUpAltIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="downvote" onClick={() => handleVote('downvote')}>
                                        <ThumbDownAltIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Paper>
                )}
                {/* Comment Form */}
                <Paper elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                    <Typography variant="h5" gutterBottom>
                        Add a comment
                    </Typography>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleComment();
                    }}>
                        <TextField
                            name="commentText"
                            label="Add a comment"
                            variant="outlined"
                            fullWidth
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            margin="normal"
                            sx={{ marginBottom: '20px' }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={anonymous}
                                    onChange={() => setAnonymous(!anonymous)}
                                    color="error"
                                />
                            }
                            label="Post Anonymously"
                        />
                        <Button type="submit" variant="contained" color="error">
                            Comment
                        </Button>
                    </form>
                </Paper>
                {/* Comment Section */}
                {post && post.comments.map(comment => (
                    <Paper key={comment._id} elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                        <ListItem alignItems="flex-start">
                            <Avatar alt={comment.name} src="/static/images/avatar/1.jpg" />
                            <ListItemText
                                primary={comment.comment}
                                secondary={
                                    <>
                                        <Typography variant="caption" display="block" gutterBottom>
                                            Comment by {comment.anonymous ? 'Anonymous' : comment.name} • {formatDate(comment.createdAt)}
                                        </Typography>
                                    </>
                                }
                            />
                            {(user && (user.role === 'Admin' || user.erp === comment.erp)) && (
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    </Paper>
                ))}
            </Container>
        </Box>
    );
};

export default PostPage;
