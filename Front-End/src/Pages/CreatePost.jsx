import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import './../Css/CreatePost.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
// import { useState, CSSProperties } from "react";
import BarLoader from "react-spinners/BarLoader";


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

  const uploadImage = (e) => {
    e.preventDefault();
    if (image === null) {
      setImageError('Please upload an image');
      return;
    }
    setUploading(true);

    const imageRef = ref(storage, `images/${image.name + v4()}`);
    uploadBytes(imageRef, image).then((file) => {
      alert('Image Uploaded');
      getDownloadURL(file.ref).then((url) => {
        setImage(url);
        setImageError('');
        setUploading(false); 
      });
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
            {titleError && <p className="error">{titleError}</p>}
          </div>
          <div>
            <input
              type="text"
              className='topInputs'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Add a Description'
            />
            {descriptionError && <p className="error">{descriptionError}</p>}
          </div>
          <div className='imageAndCategory'>
            <div className='box'>
              <input type="file" onChange={(event) => setImage(event.target.files[0])} />
              <button onClick={uploadImage}>{uploading ? <BarLoader/> : "Upload Image"}</button>
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
                  ['link', 'image', 'video'],
                  ['clean']
                ],
              }}
            />
            {contentError && <p className="error">{contentError}</p>}
          </div>
          <button type='submit' className='CPBTN' onClick={handleSubmit}>Create Post</button>
        </form>
      </div>
    </>
  )
}

export default CreatePost;
