import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import './../Css/CreatePost.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Alert } from '@mui/material';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Cookies from 'js-cookie';
import { SnackbarProvider, useSnackbar } from 'notistack';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [imageError, setImageError] = useState('');
  const [contentError, setContentError] = useState('');
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
            'Content-Type': 'application/json' 
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
    }

    fetchUserName();

  }, []);

  const uploadImage = (e) => {
    e.preventDefault();
    if (!image) {
      setImageError('Please select an image to upload');
      return;
    }
    setUploading(true);

    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image)
      .then((file) => {
        enqueueSnackbar('Image Uploaded', { variant: 'success' });
        getDownloadURL(file.ref).then((url) => {
          setImage(url);
          setImageError('');
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
    setTitleError('');
    setDescriptionError('');
    setImageError('');
    setContentError('');

    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    if (!description.trim()) {
      setDescriptionError('Description is required');
      return;
    }
    if (!content.trim()) {
      setContentError('Content is required');
      return;
    }
    if (!image) {
      setImageError('Please upload an image');
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
        enqueueSnackbar('You can only post 10 blogs per day.', { variant: 'info' });
        return;
      }

      const data = await response.json();
      if (response.ok) {
        console.log('Blog post created successfully:', data);
        setTitle('');
        setDescription('');
        setSelectedCategory('');
        setContent('');
        setImage('');
        enqueueSnackbar('Blog Post Created Successfully', { variant: 'success' });
        setImageError('Please upload an image');
        setTimeout(() => {
          navigate('/');
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
            {titleError && <Alert severity="info">{titleError}</Alert>}
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
            {descriptionError && <Alert severity="info">{descriptionError}</Alert>}
          </div>
          <div className='box'>
            <input type="file" onChange={(event) => setImage(event.target.files[0])} />
            <Button
              style={{ padding: '0.5vw 0.5vw 0.5vw 0.5vw', backgroundColor: '#4caf60', fontSize: "0.65rem" }}
              component="label"
              className='uploadB'
              role={undefined}
              variant="contained"
              tabIndex={-1}
              onClick={uploadImage}
              startIcon={<CloudUploadIcon />}
            >{uploading ? <BarLoader /> : "Upload Image"}
            </Button>
          </div>
          {imageError && <p className="error">{imageError}</p>}

          <FormControl className='formControl category'>
            <InputLabel id="category-select-label">Select a category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Select a category"
              onChange={handleSelectChange}
            >
              <MenuItem value="education">Education - Learn something new</MenuItem>
              <MenuItem value="technology">Technology - Explore the latest tech</MenuItem>
              <MenuItem value="travel">Travel - Discover new destinations</MenuItem>
              <MenuItem value="health">Health - Focus on well-being</MenuItem>
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
            {contentError && <Alert severity="info">{contentError}</Alert>}
          </div>
          <Button type='submit' className='CPBTN' style={{ height: "3vw", backgroundColor: '#4caf50', marginBottom: '2.5vw' }} variant="contained">Create Post</Button>
        </form>
      </div>
    </>
  );
}

export default function CreatePostWithSnackbar() {
  return (
    <SnackbarProvider maxSnack={3}>
      <CreatePost />
    </SnackbarProvider>
  );
}
