import React, { useState, useEffect } from 'react';
import '../Css/PostsComponent.css';
import profile from '../assets/Profile.png'
import dots from '../assets/dots.png'

function PostsComponent() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    fetch('http://localhost:1111/blog')
      .then(response => response.json())
      .then(data => {
        setBlogs(data.blogs);
        const uniqueCategories = [...new Set(data.blogs.map(blog => blog.selectedCategory))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredBlogs = selectedCategory
    ? blogs.filter(blog => blog.selectedCategory === selectedCategory)
    : blogs;

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

        {filteredBlogs.map((blog, index) => (
          <div key={index} className='container-box'>
            <div className='user-data-div'>

                <div className='profile-div'>
                    <img src={profile} alt="profile" className='profile'/>
                    <div className='user-div'>
                        <span className='cb'>Created By</span>  
                        <span className='un'>{blog.username}</span>
                    </div>
                </div>

                <div><button className='dot-btn'><img src={dots} alt="dots" className='dots' /></button></div>

            </div>
            <div className='data-div'>
                <p className='title'>{blog.title}</p>
                <div className='img-div'>
                    <img src={blog.image} style={{height:"25vw"}} />
                </div>
                <h2>{blog.description}</h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: blog.content }}></p>
            <p>Category: {blog.selectedCategory}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostsComponent;
