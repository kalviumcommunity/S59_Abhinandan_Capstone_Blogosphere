import React, { useState, useEffect } from 'react';
import '../Css/PostsComponent.css';
import profile from '../assets/Profile.png';
import dots from '../assets/dots.png';

function PostsComponent() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [error, setError] = useState(null); // State to hold error information

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
        const uniqueCategories = [...new Set(data.blogs.map(blog => blog.selectedCategory))];
        setCategories(uniqueCategories);
      })
      .catch(error => {
        setError(error);
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const toggleReadMore = (index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index].isReadMoreVisible = !updatedBlogs[index].isReadMoreVisible;
    setBlogs(updatedBlogs);
  };

  const toggleLike = (index) => {
    const updatedBlogs = [...blogs];
    updatedBlogs[index].isLiked = !updatedBlogs[index].isLiked;
    setBlogs(updatedBlogs);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='container'>
      <div>
        <div className="dropHead">
          <div className='dropMenu'>
            <h1>Read Blogs for </h1>
            <div className="dropdown" onMouseLeave={() => setIsDropdownVisible(false)}>
              <h1 className='menu' onMouseOver={() => setIsDropdownVisible(true)}>
                {selectedCategory ? selectedCategory : 'All Categories'}
              </h1>
              {isDropdownVisible && (
                <div className="dropdown-content">
                  <div onClick={() => { setSelectedCategory(''); setIsDropdownVisible(false); }}>All</div>
                  {categories.map((category, index) => (
                    <div key={index} onClick={() => { setSelectedCategory(category); setIsDropdownVisible(false); }}>
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

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
                <div>
                  <button className='dot-btn'>
                    <img src={dots} alt="dots" className='dots' />
                  </button>
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
                {blog.isReadMoreVisible ? (
                  <div>
                    <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
                    <p className='read' onClick={() => toggleReadMore(index)}>Read Less</p>
                  </div>
                ) : (
                  <div>
                    <p className='quillp' dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 700) }}></p>
                    <p className='read' onClick={() => toggleReadMore(index)}>Read More</p>
                  </div>
                )}
              </div>
            </div>  
            <div className='interact'>
              <i className={blog.isLiked ? 'bx bxs-heart beat-heart' : 'bx bx-heart'} style={{color: "red", fontSize:"2vw"}} onClick={() => toggleLike(index)} ></i>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default PostsComponent;
