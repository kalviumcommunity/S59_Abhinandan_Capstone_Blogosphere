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
import BelowNavbar from './BelowNavbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Cookies from 'js-cookie'

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
  const [userId, setUserId] = useState('');
  const [isLiked, setIsliked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  

  const { enqueueSnackbar } = useSnackbar();

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
            setUserId(responseData._id);
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/blog`)
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
      });
      if (response.ok) {
        const updatedBlogs = blogs.filter(blog => blog._id !== blogId);
        setBlogs(updatedBlogs);
        console.log('Blog deleted successfully');
        setDeleteConfirmation(null);
        toast.success("Blog Deletion successful.");
        enqueueSnackbar('Blog Deletion successful.', { variant: 'success' });
      } 
      else {
        console.error('Failed to delete blog:', response.statusText);
        toast.error('Failed to delete blog:', response.statusText);
        enqueueSnackbar('Failed to delete blog', { variant: 'error' });
      }
    } 
    catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedPost = {
        ...editPost,
        title: editedTitle,
        description: editedDescription,
        content: editedContent
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND}/blog/update/${editPost._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
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
        enqueueSnackbar('Blog Updated Successfully.', { variant: 'success' });
        setEditPost(null);
        setEditedTitle('');
        setEditedDescription('');
        setEditedContent('');
      } 
      else {
        console.error('Failed to update blog:', response.statusText);
        toast.success('Failed to update blog:', response.statusText);
        enqueueSnackbar('Failed to update blog', { variant: 'error' });
      }
    } 
      catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditPost(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedContent('');
  };

  const toggleLike = async (blogId, index) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/blog/like/${blogId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
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
        enqueueSnackbar('Blog liked successfully.', { variant: 'success' });

      }
      else {
        console.error('Failed to like blog:', response.statusText);
        toast.error('Failed to like blog:', response.statusText);
        enqueueSnackbar('Failed to like blog', { variant: 'error' });
      }
    }
    catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Error liking blog:', error);
      enqueueSnackbar('Error liking blog', { variant: 'error' });
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

  const handleCategoryChange = e => {
    setSelectedCategory(e.target.value);
  };

  const uniqueCategories = ['All', ...new Set(blogs.map(blog => blog.selectedCategory))];

  const filteredBlogs = selectedCategory === 'All' ? blogs : blogs.filter(blog => blog.selectedCategory === selectedCategory);

  const searchedBlogs = filteredBlogs.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className='container'>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className='searchAndFilter'>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="large">
              <InputLabel id="demo-simple-select-autowidth-label">Filter by Category</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={selectedCategory}
                label="Filter by Category"
                onChange={handleCategoryChange}
              >
                {uniqueCategories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            

            <TextField
              id="filled-search"
              label="Search by Title"
              type="search"
              variant="filled"
              className='searchBar'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchedBlogs.length === 0 ? (
            <div className='noPostDiv'>
              <p>No such post available with this title.</p>
            </div>
            
            ) : (
            searchedBlogs.map((blog, index) => (
              <React.Fragment key={index}>
                <div className='container-box'>
                  <div className='user-data-div'>

                    <div className='profile-div'>
                      <img src={profile} alt="User-profile" className='profile' />
                      <div className='user-div'>
                        <span className='cb'>Created By</span>
                        <span className='un'>{blog.username}</span>
                      </div>
                    </div>

                    {username === blog.username && (
                      <div style={{ position: "relative" }}  >
                        <IconButton className='option-BTN' onClick={() => toggleEdOptions(index)} style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px" }}>
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
                      <p className='categoryBlog'><i>Category: {blog.selectedCategory}</i></p>
                    </div>
                    <div className='img-div'>
                      <img src={blog.image} className='blog-img' alt="Blog" />
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
                        <span className='read-more' onClick={() => toggleReadMore(index)} style={{"cursor" : "pointer "}}>
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
                        className={blog.likedBy.includes(userId) ? 'bx bxs-heart beat-heart' : 'bx bx-heart'}
                        id='heartIcon'
                        onClick={() => toggleLike(blog._id, index)}
                      ></i>
                      <div className='likesCount'>{blog.likes}</div>
                    </div>
                    <Link to="/addComment" state={{ blog }} style={{ textDecoration: "none" }}>
                      <button className="add-comment">Add a Comment</button>
                    </Link>
                  </div>
                ) : (
                  <div className="interact-notLogIN">
                    <span style={{ color: 'grey' }}>Log In to interact !</span>
                  </div>
                )}

              </React.Fragment>
            ))
          )}
        </div>
      )}

      {editPost && (
        <div className="edit-post-popup" onClick={(e) => {
          if (e.target !== e.currentTarget) {
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
          if (e.target !== e.currentTarget) {
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
