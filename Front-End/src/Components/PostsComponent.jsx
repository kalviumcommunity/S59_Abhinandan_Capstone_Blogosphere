import React, { useState, useEffect } from 'react';
import '../Css/PostsComponent.css';
import Loader from './Loader';
import profile from '../assets/Profile.png';
import dots from '../assets/dots.png';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@mui/material/IconButton';

function PostsComponent() {
  const [blogs, setBlogs] = useState([]);
  const [showEdOptions, setShowEdOptions] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [userId, setUserId] = useState('')
  const [isLiked, setIsliked] = useState(false)

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:1111/user/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const responseData = await response.json();
          if (responseData) {
            setUsername(responseData.username);
            setUserId(responseData._id)
          } 
          else {
            console.error('Empty response data');
          }
        } 
        else {
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
        const updatedBlogs = data.blogs.map(blog => ({
          ...blog,
          isLiked: blog.likedBy.includes(username)
        }));
        setBlogs(updatedBlogs.reverse());
        setShowEdOptions(Array(data.blogs.length).fill(false));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [username]);

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
        toast.success("Blog Deletion successful.");
      } else {
        console.error('Failed to delete blog:', response.statusText);
        toast.error('Failed to delete blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedPost = { ...editPost, 
        title: editedTitle, 
        description: editedDescription, 
        content: editedContent };

      const response = await fetch(`http://localhost:1111/blog/update/${editPost._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });
      if (response.ok) {
        const updatedBlogs = blogs.map(blog =>
          blog._id === editPost._id ? updatedPost : blog
        );
        setBlogs(updatedBlogs);
        console.log('Blog updated successfully');
        toast.success('Blog Updated Successfully.');
        setEditPost(null);
        setEditedTitle('');
        setEditedDescription('');
        setEditedContent('');
      } else {
        console.error('Failed to update blog:', response.statusText);
        toast.success('Failed to update blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };
  
  const handleCancelEdit = () => {
    setEditPost(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedContent('');
  };

  const toggleLike = async (blogId, index) => {      // used the relation to get the user id in the liked by array
    try {                                            // relationship between entities
      const response = await fetch(`http://localhost:1111/blog/like/${blogId}`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {

        const updatedBlog = await response.json();
        const updatedBlogs = [...blogs];

        updatedBlogs[index] = {
          ...updatedBlogs[index],
          likes: updatedBlog.likes,
          isLiked: !updatedBlogs[index].isLiked
        }

        setBlogs(updatedBlogs);

      } 
      else {
        console.error('Failed to like blog:', response.statusText);
        toast.error('Failed to like blog:', response.statusText);
      }
    } 
    catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Error liking blog:', error);
    }
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
                      <IconButton onClick={() => toggleEdOptions(index)} style={{boxShadow:"rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px"}}>
                        <img src={dots} alt="dots" className='dots' />
                      </IconButton>
                      {showEdOptions[index] && (
                        <div className='ed-options'>
                          <button onClick={() => {
                            setEditPost(blog);
                            setEditedTitle(blog.title);
                            setEditedDescription(blog.description);
                            setEditedContent(blog.content);
                          }}>Edit</button>
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
                    <img src={blog.image} style={{ height: "20vw" }} alt="Blog"/>
                  </div>

                  <div className='des-div'>
                    <span className='des'>{blog.description}</span>
                    <span className='blog-time'>{formatDate(blog.createdAt)}</span>
                  </div>
                  
                  <div className='line'></div>

                  <div className='quillp'>

                    {blog.isContentExpanded ? (
                      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: blog.content.slice(0, 570) }} />
                    )}

                    {blog.content.length > 500 && (
                      <span className='read-more' onClick={() => toggleReadMore(index)}>
                        <span style={{ color: '#12559f' }}>{blog.isContentExpanded ? 'Read Less' : 'Read More..'}</span>
                      </span>
                    )}

                  </div>

                </div>
              </div>

              {username ? (
                <div className="interact">
                  <div className='likesDiv'>
                    <i
                      className={ blog.likedBy.includes(userId) ? 'bx bxs-heart beat-heart' : 'bx bx-heart'}
                      style={{ color: 'red', fontSize: '2vw' }}
                      onClick={() => toggleLike(blog._id, index)}
                    ></i>
                    <div className='likesCount'>{blog.likes}</div>
                  </div>
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

      {editPost && (
        <div className="edit-post-popup" onClick={(e) => {
          if(e.target !== e.currentTarget) {
            return;
          }
          handleCancelEdit();
        }}>
          <div className="edit-post-popup-content">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Title"
            />
            <input
              type='text'
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Description"
            />
            <ReactQuill
              value={editedContent}
              onChange={(content) => setEditedContent(content)}
              placeholder="Content"
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'size': [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' },
                  { 'indent': '-1' }, { 'indent': '+1' }],
                  ['clean']
                ],
              }}
            />
            <div>
              <Button onClick={handleUpdate} variant="contained" style={{ backgroundColor: '#26653e', color: '#fff', marginRight: '10px' }}>Update</Button>
              <Button onClick={handleCancelEdit} variant="outlined" style={{ color: '#26653e', borderColor: '#26653e' }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="modal" onClick={(e) => {
          if(e.target !== e.currentTarget) {
            return;
          }
          setDeleteConfirmation(null);
        }}>
          <div className="modal-content">
            <p>Are you sure you want to delete this blog?</p>
            <div className='delete-popup-btns'>
              <Button onClick={() => handleDelete(deleteConfirmation)} variant="contained" style={{ backgroundColor: '#26653e', color: '#fff' }}>Yes</Button>
              <Button variant="outlined" onClick={() => setDeleteConfirmation(null)} style={{ color: '#26653e', borderColor: '#26653e' }}>No</Button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default PostsComponent;
