import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import './../Css/CreatePost.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const postData = {
        title,
        description,
        selectedCategory,
        content 
      };

      const response = await fetch('http://localhost:1111/blog/createPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Blog post created successfully:', data);
        setTitle('');
        setDescription('');
        setSelectedCategory('');
        setContent('');
      } else {
        console.error('Failed to create blog post:', response.status);
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

        <form className='inputArea' onSubmit={handleSubmit}>
          <div><input
            type="text"
            className='topInputs'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Add a Title' /></div>

          <div><input
            type="text"
            className='topInputs'
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Add a Description' /></div>

          <div className='imageAndCategory'>

            <select name="category" id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="NA">Select a category</option>
              <option value="education">Education - Learn something new</option>
              <option value="technology">Technology - Explore the latest tech</option>
              <option value="travel">Travel - Discover new destinations</option>
              <option value="health">Health - Focus on well-being</option>
            </select>
          </div>

          <div className='quillDiv'>
            <ReactQuill
              theme="snow"
              className='Editor'
              onChange={value => setContent(value)}
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
          </div>

          <button type='submit' className='CPBTN'>Create Post</button>

        </form>

      </div>
    </>
  )
}

export default CreatePost;
