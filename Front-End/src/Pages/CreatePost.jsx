import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import './../Css/CreatePost.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Alert } from '@mui/material';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('education');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [imageError, setImageError] = useState('');
  const [contentError, setContentError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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
        alert('Image Uploaded');
        getDownloadURL(file.ref).then((url) => {
          setImage(url);
          setImageError('');
          setUploading(false); 
        });
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        setUploading(false); 
        toast.error('Error uploading image. Please try again later.');
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
      };

      const response = await fetch('http://localhost:1111/blog/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });
     
      if (response.status === 401) {
        alert('You need to log in to create a post.')
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
        toast.success('Blog Post Created Succesfully')
        setImageError('Please upload an image')
        setTimeout(() => {
          navigate('/')
        }, 2000);

      } else {
        console.error('Failed to create blog post:', data.message);
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pageContainer">
        <div className='heading'>Add Your Own Blog!</div>
        <form className='inputArea'>
          <div>
            <input
              type="text"
              className='topInputs'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Add a Title'
            />
            {titleError && <Alert severity="info">{titleError}</Alert> }
          </div>
          <div>
            <input
              type="text"
              className='topInputs'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Add a Description'
            />
            {descriptionError && <Alert severity="info">{descriptionError}</Alert> }
          </div>
          <div className='imageAndCategory'>
            <div className='box'>
              <input type="file" onChange={(event) => setImage(event.target.files[0])} />
              <Button
                style={{padding:'5px 8px 5px 8px', backgroundColor:'#4caf60', fontSize:"0.65rem"}}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                onClick={uploadImage}
                startIcon={<CloudUploadIcon />}
              >{uploading ? <BarLoader/> : "Upload Image"}
              </Button>
            </div>
            <select name="category" id="category" value={selectedCategory} onChange={handleSelectChange}>
              <option value="NA">Select a category</option>
              <option value="education">Education - Learn something new</option>
              <option value="technology">Technology - Explore the latest tech</option>
              <option value="travel">Travel - Discover new destinations</option>
              <option value="health">Health - Focus on well-being</option>
            </select>
          </div>
            {imageError && <p className="error">{imageError}</p>}
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
            {contentError && <Alert severity="info">{contentError}</Alert> }
          </div>
          <Button type='submit' className='CPBTN' onClick={handleSubmit} style = {{backgroundColor:'#4caf50', marginBottom:'2.5vw'}} variant="contained">Create Post</Button>
        </form>
      </div>
      <ToastContainer/>
    </>
  )
}

export default CreatePost;
