import React from 'react'
import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar'
import SideNavBarClose from '../Components/SideNavBarClose'

function LikedPostSection() {

  const [Blogs, setBlogs] = useState([])
  const [userId, setUserId] = useState('')

  useEffect(() => {
    fetch('http://localhost:1111/blog')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const updatedBlogs = data.blogs.map(blog => ({
          ...blog
        }));
        setBlogs(updatedBlogs)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('http://localhost:1111/user/profile', {
          credentials: 'include',
        });
        if (response.ok) {
          const responseData = await response.json();
          if (responseData) {
            setUserId(responseData._id)
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
    fetchUserId();
  }, []);

  const likedPosts = Blogs.filter(blog => blog.likedBy.includes(userId));
  console.log(likedPosts)

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <SideNavBarClose />
        </div>
        <div style={{ height: "calc(100vh - 8vw)", overflowY: "scroll", width: "100vw" }}>
          <div>
          {
            likedPosts.map(post => (
              <div key={post._id}>
                <p>{post.title}</p>
              </div>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default LikedPostSection