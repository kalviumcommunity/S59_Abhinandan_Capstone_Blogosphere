import React from 'react';
import Navbar from '../Components/Navbar';
import SideNavBarClose from '../Components/SideNavBarClose';
import BelowNavbar from '../Components/BelowNavbar';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import '../Css/Dashboard.css';
import { useSnackbar } from 'notistack';
import EditPostPopup from '../Components/EditPostPopup';
import DeleteConfirmation from '../Components/DeleteConfirmation';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  console.log(blogs);

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
    const fetchBlogData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/blog`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogs(data.blogs);
      } catch (error) {
        setError(error);
        console.error('Error fetching blog posts:', error);
      }
    };
    fetchBlogData();
  }, []);

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
        enqueueSnackbar('Blog Updated Successfully.', { variant: 'success' });
        setEditPost(null);
        setEditedTitle('');
        setEditedDescription('');
        setEditedContent('');
      } else {
        console.error('Failed to update blog:', response.statusText);
        enqueueSnackbar('Failed to update blog', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      enqueueSnackbar('Error updating blog', { variant: 'error' });
    }
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
        setDeleteConfirmation(null);
        enqueueSnackbar('Blog Deletion successful.', { variant: 'success' });
      } else {
        console.error('Failed to delete blog:', response.statusText);
        enqueueSnackbar('Failed to delete blog', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      enqueueSnackbar('Error deleting blog', { variant: 'error' });
    }
  };

  function truncatePostContent(content) {
    const words = content.split(' ');
    const truncatedContent = words.slice(0, 12).join(' ');
    return `${truncatedContent}...`;
  }

  const userPosts = blogs ? blogs.filter(post => post.username === username) : [];

  const handleCancelEdit = () => {
    setEditPost(null);
    setEditedTitle('');
    setEditedDescription('');
    setEditedContent('');
  };

  return (
    <div className='top-mostDiv-likedPost overflow-hidden h-screen flex flex-col'>
      <div>
        <Navbar />
      </div>
      <div className='everyOneDiv-likedpost flex flex-row flex-1 overflow-hidden'>

        <div className='sidenavDIV'>
          <SideNavBarClose />
        </div>

        <div className='flex justify-center my-9 overflow-y-scroll' style={{ height: "calc(100vh - 8vw)", overflowY: "scroll", width: "100vw", 'fontFamily': '"ABeeZee", sans-serif' }}>
          <div className='flex flex-col w-11/12'>
            <div className='flex justify-center items-center flex-col'>
              <div><span className='text-6xl'>Welcome,</span> <span style={{ 'fontFamily': '"Concert One", sans-serif' }} className='text-green-700 text-6xl'>{username}</span></div>
              <p className='text-xl mt-3 mb-7 typing-animation'>What would you like to blog about?</p>
            </div>
            <div className='flex flex-row gap-10'>
              <div className="flex flex-col h-96 w-7/12 shadow-lg bg-white overflow-y-scroll rounded-xl">
                <div className='h-20 w-full shadow rounded-t-xl flex items-center pl-6 pt-2 pb-2 text-2xl'><span>Your Posts</span></div>

                {userPosts.length > 0 ? (
                  userPosts.map(post => (
                    <div key={post._id} className='h-28 w-full shadow hover:bg-gray-200 pl-4 pt-2 pb-2 pr-4 text-2xl flex justify-between flex-row'>
                      <div className='flex justify-center flex-col'>
                        <h2 className='text-base my-2'>{post.description}</h2>
                        <span className='text-xs' dangerouslySetInnerHTML={{ __html: truncatePostContent(post.content) }} />
                      </div>
                      <div className='flex justify-center flex-row'>
                        <IconButton onClick={() => {
                          setEditPost(post);
                          setEditedTitle(post.title);
                          setEditedDescription(post.description);
                          setEditedContent(post.content);
                        }}>
                          <i className='bx bxs-edit'></i>
                        </IconButton>
                        <IconButton onClick={() => setDeleteConfirmation(post._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-500 mt-4'>You haven't made any posts yet.</p>
                )}
              </div>

              <div className='h-96 w-6/12 flex flex-col'>
                <div className='h-40 w-12/12 shadow-lg p-4 rounded-xl'>
                  {/* Add any additional content or widgets here */}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
      <div className='newNav-like hidden'>
        <BelowNavbar />
      </div>

      {editPost && (
        <EditPostPopup
          editedTitle={editedTitle}
          editedDescription={editedDescription}
          editedContent={editedContent}
          handleUpdate={handleUpdate}
          handleCancelEdit={handleCancelEdit}
          setEditedTitle={setEditedTitle}
          setEditedDescription={setEditedDescription}
          setEditedContent={setEditedContent}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmation
          handleDelete={() => handleDelete(deleteConfirmation)}
          setDeleteConfirmation={setDeleteConfirmation}
        />
      )}
    </div>
  );
}

export default Dashboard;
