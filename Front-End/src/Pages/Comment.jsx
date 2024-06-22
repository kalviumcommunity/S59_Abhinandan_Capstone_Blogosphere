import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../Css/Comment.css';
import profile from '../assets/Profile.png';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Cookies from 'js-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';

function Comment() {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [blogData, setBlogData] = useState({});
  const [comment, setComment] = useState('');
  const [commentsData, setCommentsData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [order, setOrder] = useState(false);
  const blogTitle = blogData.title;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (location.state && location.state.blog) {
      setBlogData(location.state.blog);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/user/profile`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json'
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          if (responseData) {
            setUsername(responseData.username);
          } 
          else {
            console.error('Empty response data');
          }
        } 
        else {
          setUsername('');
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } 
      catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserName();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCommentId) {
      handleEditSubmit();
    } 
    else {
      handleAddComment();
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/review/addComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({
          username,
          comment,
          commentedFor: blogData.title,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        enqueueSnackbar('Comment added successfully!', { variant: 'success' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        setComment('');
        setCommentsData([...commentsData, responseData]);
      } 
      else {
        console.error('Failed to submit comment:', response.statusText);
        enqueueSnackbar('Error submitting comment:', { variant: 'error' });
      }
    } 
    catch (error) {
      console.error('Error submitting comment:', error);
      enqueueSnackbar('Error submitting comment:', { variant: 'error' });
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/review/deleteComment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });

      if (response.ok) {
        enqueueSnackbar('Comment deleted successfully!', { variant: 'success' });
        setCommentsData(commentsData.filter((comment) => comment._id !== commentId));
        setDeleteConfirmation(null);
      } 
      else {
        console.error('Failed to delete comment:', response.statusText);
        enqueueSnackbar('Failed to delete comment', { variant: 'error' });
      }
    } 
    catch (error) {
      console.error('Error deleting comment:', error);
      enqueueSnackbar('Failed to delete comment', { variant: 'error' });
    }
  };

  const handleEdit = (comment) => {
    setEditCommentId(comment._id);
    setComment(comment.comment);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/review/updateComment/${editCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify({ comment }),
      });

      if (response.ok) {
        enqueueSnackbar('Comment updated successfully!', { variant: 'success' });
        setCommentsData(commentsData.map((comm) => (comm._id === editCommentId ? { ...comm, comment } : comm)));
        setEditCommentId(null);
        setComment('');
      } 
      else {
        console.error('Failed to update comment:', response.statusText);
        enqueueSnackbar('Failed to update comment', { variant: 'error' });
      }
    } 
    catch (error) {
      console.error('Error updating comment:', error);
      enqueueSnackbar('Failed to update comment', { variant: 'error' });
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/review/comments?title=${blogData.title}`);
        if (response.ok) {
          const responseData = await response.json();
          const filteredComments = responseData.filter((comment) => comment.commentedFor === blogTitle);
          if (order) {
            setCommentsData(filteredComments);
          }
          setCommentsData(filteredComments.reverse());
        } 
        else {
          console.error('Failed to fetch comments:', response.statusText);
        }
      } 
      catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (blogData.title) {
      fetchComments();
    }
  }, [blogData.title]);

  const handleSort = () => {
    setCommentsData((prevCommentsData) => prevCommentsData.slice().reverse());
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <React.Fragment>
      <div className='grid-container'>
        <div className='post-div'>
          <div className='data-container'>
            <div className='user-info'>
              <div className='picAndName'>
                <img src={profile} alt='pro-pic' className='profile' />
                <div className='info'>
                  <span className='pb'>Posted By</span>
                  <span className='bun'>{blogData.username}</span>
                </div>
              </div>
              <div className='date-div'>
                <span className='date'>{blogData.createdAt ? formatDate(blogData.createdAt) : ''}</span>
              </div>
            </div>
            <div className='thisline'></div>
            <div className='post-img'>
              <img src={blogData.image} alt='Blog' className='img' />
            </div>
            <div className='thisline'></div>
            <div className='title-category'>
              <span className='post-title'>{blogData.title}</span>
              <span className='post-category'>
                <i>Category: {blogData.selectedCategory}</i>
              </span>
            </div>
            <div className='content-div'>
              <span className='content' dangerouslySetInnerHTML={{ __html: blogData.content }} />
            </div>
          </div>
        </div>

        <div className='comment-div'>
          <div className='comment-heading'>
            <span>{editCommentId ? 'Edit your Comment' : 'Add your Comment here!'}</span>
          </div>
          <div className='thisline'></div>
          <form onSubmit={handleSubmit} className='comment-field'>
            <TextField
              id='filled-basic'
              label='Enter your comment here'
              variant='outlined'
              onChange={(e) => setComment(e.target.value)}
              required
              value={comment}
            />
            <Button style={{ backgroundColor: '#26653e' }} variant='contained' endIcon={<SendIcon />} type='submit'>
              {editCommentId ? 'Update' : 'Comment'}
            </Button>
            {editCommentId && (
              <Button
                variant='outlined'
                onClick={() => {
                  setEditCommentId(null);
                  setComment('');
                }}
                style={{ marginLeft: '10px', color: '#26653e', borderColor: '#26653e' }}
              >
                Cancel
              </Button>
            )}
          </form>
          <div className='read-comments-for'>
            <span>Read Comments here ...</span>
            <IconButton onClick={handleSort}>
              <i className='bx bx-sort-alt-2'></i>
            </IconButton>
          </div>
          <div className='user-comment-container'>
            {commentsData.length > 0 ? (
              commentsData.map((comment, index) => (
                <div key={index}>
                  <div className='updiv'>
                    <div className='whole-comm-div'>
                      <div className='comment-user-detail'>
                        <img src={profile} alt='image' className='comment-pic' />
                        <div className='comment-user-info'>
                          <span className='comm-cb'>Comment By</span>
                          <span className='comment-un'>{comment.username}</span>
                        </div>
                      </div>
                      <div>
                        <span className='comment-time'>{comment.createdAt ? formatDate(comment.createdAt) : ''}</span>
                      </div>
                    </div>
                    <div className='thisline'></div>
                    <div className='comm-BTN'>
                      <p className='comm-des'>{comment.comment}</p>
                      {username === comment.username && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <IconButton onClick={() => handleEdit(comment)}>
                            <i className='bx bxs-edit'></i>
                          </IconButton>
                          <IconButton onClick={() => setDeleteConfirmation(comment._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
        {deleteConfirmation && (
          <div
            className='modal'
            onClick={(e) => {
              if (e.target !== e.currentTarget) {
                return;
              }
              setDeleteConfirmation(null);
            }}
          >
            <div className='modal-content'>
              <p>Are you sure you want to delete this comment?</p>
              <div className='delete-popup-btns'>
                <Button
                  onClick={() => handleDelete(deleteConfirmation)}
                  variant='contained'
                  style={{ backgroundColor: '#26653e', color: '#fff' }}
                >
                  Yes
                </Button>
                <Button
                  variant='outlined'
                  onClick={() => setDeleteConfirmation(null)}
                  style={{ color: '#26653e', borderColor: '#26653e' }}
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default function CommentWithSnackbar() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Comment />
    </SnackbarProvider>
  );
}
