import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import './../Css/CreatePost.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { TextField, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import Cookies from 'js-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { FileInput } from "flowbite-react";

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/user/profile`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          if (responseData && responseData.username) {
            setUsername(responseData.username);
          } 
          else {
            console.error('Empty response data or username not found.');
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

  const uploadImage = (e) => {
    e.preventDefault();
    if (!image) {
      enqueueSnackbar('Please select an image to upload', { variant: 'error' });
      return;
    }
    setUploading(true);

    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image)
      .then((file) => {
        enqueueSnackbar('Image Uploaded Succesfully!', { variant: 'success' });
        getDownloadURL(file.ref).then((url) => {
          setImage(url);
          setUploading(false);
        });
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        setUploading(false);
        enqueueSnackbar('Error uploading image. Please try again later.', { variant: 'error' });
      });
  };

  const handleSelectChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      enqueueSnackbar('Title is required', { variant: 'info' });
      return;
    }
    if (!description.trim()) {
      enqueueSnackbar('Description is required', { variant: 'info' });
      return;
    }
    if (!content.trim()) {
      enqueueSnackbar('Content is required', { variant: 'info' });
      return;
    }
    if (!image) {
      enqueueSnackbar('Please upload an image', { variant: 'info' });
      return;
    }

    try {
      const postData = {
        title,
        description,
        selectedCategory,
        content,
        image,
        username,
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND}/blog/createPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token')}`,
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });

      if (response.status === 401) {
        enqueueSnackbar('You need to log in to create a post.', { variant: 'error' });
        return;
      }

      if (response.status === 429) {
        enqueueSnackbar('You can only post 10 blogs per day. Come again tomorrow to make this post live.', { variant: 'info' });
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setTitle('');
        setDescription('');
        setSelectedCategory('');
        setContent('');
        setImage('');
        enqueueSnackbar('Blog Post Created Successfully', { variant: 'success' });
        setTimeout(() => {
          navigate('/posts');
        }, 2000);
      } 
      else {
        console.error('Failed to create blog post:', data.message);
        enqueueSnackbar(data.message || 'Failed to create blog post.', { variant: 'error' });
      }
    }
    catch (error) {
      console.error('Error creating blog post:', error);
      enqueueSnackbar('Error creating blog post. Please try again later.', { variant: 'error' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="pageContainer">
        <div className='heading'>Add Your Own Blog!</div>
        <form className='inputArea' onSubmit={handleSubmit}>
          <div>
            <TextField
              id="outlined-basic"
              label="Add a Title"
              variant="outlined"
              type="text"
              className='topInputs'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Add a Description"
              variant="outlined"
              type="text"
              className='topInputs'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className='fileField' style={{ display: "flex" }}>
            <FileInput id="large-file-upload" className='fileArea' onChange={(event) => setImage(event.target.files[0])} sizing="lg" />
            <IconButton onClick={uploadImage} style={{ "backgroundColor": "#ffffff" }} className='uploadB' aria-label="delete" size="large">
              {uploading ? <ClipLoader /> : <CloudUploadIcon fontSize="inherit" />}
            </IconButton>
          </div>

          <FormControl className='formControl category'>
            <InputLabel id="category-select-label">Select a category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Select a category"
              onChange={handleSelectChange}
            >
              <MenuItem value="education">Education - Learn something new.</MenuItem>
              <MenuItem value="technology">Technology - Explore the latest tech!</MenuItem>
              <MenuItem value="travel">Travel - Discover new destinations.</MenuItem>
              <MenuItem value="health">Health - Focus on well-being.</MenuItem>
              <MenuItem value="parenting">Parenting - Guiding family growth.</MenuItem>
              <MenuItem value="finance">Finance - Money management insights.</MenuItem>
              <MenuItem value="photography">Photography - Visual storytelling exploration.</MenuItem>
              <MenuItem value="business/entrepreneurship">Business and Entrepreneurship - Innovation and leadership.</MenuItem>
              <MenuItem value="music">Music - Passion, rhythm, expression.</MenuItem>
              <MenuItem value="food">Food - Explore the menu.</MenuItem>
              <MenuItem value="sports">Sports - Insights into sports events.</MenuItem>
              <MenuItem value="lifestlye">Lifestyle - So what happened today?</MenuItem>
              <MenuItem value="history">History - Explore the past!</MenuItem>
            </Select>
          </FormControl>

          <div className='quillDiv'>
            <ReactQuill
              theme="snow"
              className='Editor'
              onChange={(value) => setContent(value)}
              value={content}
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'size': [] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' },
                  { 'indent': '-1' }, { 'indent': '+1' }],
                  [{ 'align': [] }],
                  ['link'],
                  ['clean']
                ],
              }}
            />
          </div>
          <Button type='submit' className='CPBTN' style={{ backgroundColor: '#4caf50' }} variant="contained">Create Post</Button>
        </form>
      </div>
    </>
  );
}

export default function CreatePostWithSnackbar() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <CreatePost />
    </SnackbarProvider>
  );
}
