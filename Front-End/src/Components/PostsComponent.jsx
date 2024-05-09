import React, { useState, useEffect } from 'react';
import '../Css/PostsComponent.css';
import profile from '../assets/Profile.png';
import dots from '../assets/dots.png';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import Button from '@mui/material/Button';

function PostsComponent() {
  const [blogs, setBlogs] = useState([]);
  const [showEdOptions, setShowEdOptions] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State to manage delete confirmation

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:1111/user/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log('Response Data:', responseData);
          if (responseData) {
            setUsername(responseData.username);
          } else {
            console.error('Empty response data');
          }
        } else {
          setUsername('');
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    fetch('http://localhost:1111/blog')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBlogs(data.blogs.reverse());
        setShowEdOptions(Array(data.blogs.length).fill(false));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const toggleLike = index => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index] = {
      ...updatedBlogs[index],
      isLiked: !updatedBlogs[index].isLiked,
    };
    setBlogs(updatedBlogs);
  };

  const toggleEdOptions = index => {
    const updatedOptions = [...showEdOptions];
    updatedOptions[index] = !updatedOptions[index];
    setShowEdOptions(updatedOptions);
  };

  const toggleReadMore = index => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index] = {
      ...updatedBlogs[index],
      isContentExpanded: !updatedBlogs[index].isContentExpanded,
    };
    setBlogs(updatedBlogs);
  };

  const handleDelete = async (blogId) => {
    try {
      const response = await fetch(`http://localhost:1111/blog/${blogId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedBlogs = blogs.filter(blog => blog._id !== blogId);
        setBlogs(updatedBlogs);
        console.log('Blog deleted successfully');
        setDeleteConfirmation(null);
      } else {
        console.error('Failed to delete blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className='container'>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {blogs.map((blog, index) => (
            <React.Fragment key={index}>
              <div className='container-box'>
                <div className='user-data-div'>
                  <div className='profile-div'>
                    <img src={profile} alt="User-profile" className='profile'/>
                    <div className='user-div'>
                      <span className='cb'>Created By</span>
                      <span className='un'>{blog.username}</span>
                    </div>
                  </div>
                  {username === blog.username && (
                    <div style={{ position: "relative" }}>
                      <button className='dot-btn' onClick={() => toggleEdOptions(index)}>
                        <img src={dots} alt="dots" className='dots' />
                      </button>
                      {showEdOptions[index] && (
                        <div className='ed-options'>
                          <button>Edit</button>
                          <button onClick={() => setDeleteConfirmation(blog._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className='line'></div>
                <div className='data-div'>
                  <div className='tcDiv'>
                    <p className='title'>{blog.title}</p>
                    <p className='category'><i>Category: {blog.selectedCategory}</i></p>
                  </div>
                  <div className='img-div'>
                    <img src={blog.image} style={{ height: "22vw" }} alt="Blog"/>
                  </div>
                  <div className='des-div'>
                    <p>{blog.description}</p>
                  </div>
                  <div className='line'></div>
                  <p className='quillp'>
                    {blog.isContentExpanded ? (
                      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 570) }} />
                    )}
                    {blog.content.length > 500 && (
                      <span className='read-more' onClick={() => toggleReadMore(index)}>
                        <span style={{ color: '#12559f' }}>{blog.isContentExpanded ? 'Read Less' : 'Read More'}</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {username ? (
                <div className="interact">
                  <i className={ blog.isLiked ? 'bx bxs-heart beat-heart' : 'bx bx-heart'}style={{ color: 'red', fontSize: '2vw' }} onClick={() => toggleLike(index)}></i>
                  <Link to="/addComment" state={{ blog }}>
                    <button className="add-comment">Add a Comment</button>
                  </Link>
                </div>
              ) : (
                <div className="interact-notLogIN">
                  <span style={{color:'grey'}}>Log In to interact !</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      {deleteConfirmation && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this blog?</p>
            <div className='delete-popup-btns'>
              <Button onClick={() => handleDelete(deleteConfirmation)} variant="contained" style={{ backgroundColor: '#26653e', color: '#fff' }}>Yes</Button>
              <Button variant="outlined" onClick={() => setDeleteConfirmation(null)} style={{ color: '#26653e', borderColor: '#26653e' }}>No</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsComponent;
