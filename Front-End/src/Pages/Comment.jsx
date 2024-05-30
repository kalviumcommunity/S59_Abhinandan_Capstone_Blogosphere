import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Comment() {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [blogData, setBlogData] = useState({});
  const [comment, setComment] = useState('');
  const [commentsData, setCommentsData] = useState([]);
  const BlogTitle = blogData.title

  useEffect(() => {
    if (location.state && location.state.blog) {
      setBlogData(location.state.blog);
    }
  }, [location.state])

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:1111/user/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const responseData = await response.json();
          if (responseData) {
            setUsername(responseData.username)
          } 
          else {
            console.error('Empty response data')
          }
        } 
        else {
          setUsername('')
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } 
      catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchUserName()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1111/review/addComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          comment,
          commentedFor: blogData.title,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success("Comment added successfully!")
        console.log('Comment submitted:', responseData);
        setComment('');
      } 
      else {
        console.error('Failed to submit comment:', response.statusText);
      }
    } 
    catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:1111/review/comments?title=${blogData.title}`);
        if (response.ok) {
          const responseData = await response.json();
          const filteredComments = responseData.filter(comment => comment.commentedFor === blogTitle);
          setCommentsData(responseData);
        } 
        else {
          console.error('Failed to fetch comments:', response.statusText);
        }
      }   catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (blogData.title) {
      fetchComments();
    }
  }, [blogData.title]);


  return (
    <div>
      <ToastContainer />
      <h1>{blogData.title}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Comment</button>
      </form>
      <div>
        <h2>Comments</h2>
        {commentsData.length > 0 ? (
          commentsData.map((comment, index) => (
            <div key={index}>
              <p><strong>{comment.username}</strong>: {comment.comment}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Comment;
