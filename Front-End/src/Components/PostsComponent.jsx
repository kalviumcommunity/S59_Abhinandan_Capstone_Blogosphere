import React, { useState, useEffect } from 'react';
import '../Css/PostsComponent.css';
import profile from '../assets/Profile.png';
import dots from '../assets/dots.png';
import { Link } from 'react-router-dom';

function PostsComponent() {
  const [blogs, setBlogs] = useState([]);
  const [showEdOptions, setShowEdOptions] = useState(false);

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
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const toggleLike = (index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index] = {
      ...updatedBlogs[index],
      isLiked: !updatedBlogs[index].isLiked
    };
    setBlogs(updatedBlogs);
  };

  const toggleEdOptions = () => {
    setShowEdOptions(!showEdOptions);
  };

  const toggleReadMore = (index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index] = {
      ...updatedBlogs[index],
      isContentExpanded: !updatedBlogs[index].isContentExpanded
    };
    setBlogs(updatedBlogs);
  };

  return (
    <div className='container'>
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
                <div style={{position:"relative"}}>
                  <button className='dot-btn' onClick={toggleEdOptions}>
                    <img src={dots} alt="dots" className='dots' />
                  </button>
                  {showEdOptions && ( 
                    <div className='ed-options'>
                      <button>Edit</button>
                      <button>Delete</button>
                    </div>
                  )}
                </div>
              </div>
              <div className='line'></div>
              <div className='data-div'>
                <div className='tcDiv'>
                  <p className='title'>{blog.title}</p>
                  <p className='category'><i>Category: {blog.selectedCategory}</i></p>
                </div>
                <div className='img-div'>
                  <img src={blog.image} style={{height:"22vw"}} alt="Blog"/>
                </div>
                <div className='des-div'>
                  <p>{blog.description}</p>
                </div>
                <div className='line'></div>
                <p className='quillp'>
                  {blog.isContentExpanded ? blog.content : blog.content.slice(0, 500)}
                  {blog.content.length > 500 && (
                    <span className='read-more' onClick={() => toggleReadMore(index)}>
                      <span style={{color:'#12559f'}}>{blog.isContentExpanded ? 'Read Less' : 'Read More'}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>  
            <div className='interact'>
              <i className={blog.isLiked ? 'bx bxs-heart beat-heart' : 'bx bx-heart'} style={{color: "red", fontSize:"2vw"}} onClick={() => toggleLike(index)} ></i>
              <Link to='/addComment' state={{blog}}><button className='add-comment'>Add a Comment</button></Link>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default PostsComponent;
