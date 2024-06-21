import React from 'react'
import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar'
import SideNavBarClose from '../Components/SideNavBarClose'
import MuiCard from '../Components/MuiCard';
import '../Css/LikedPostSection.css'
import BelowNavbar from '../Components/BelowNavbar';
import Cookies from 'js-cookie'

// made this liked post section using the liked by array in the blogs data which can by implementing the relations 

function LikedPostSection() {

  const [Blogs, setBlogs] = useState([])
  const [userId, setUserId] = useState('')
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND}/blog`)
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

  const likedPosts = Blogs.filter(blog => blog.likedBy.includes(userId));      // checking if the logged in users id is present in the liked by array

  return (

    <div className='top-mostDiv-likedPost'>
      <div>
        <Navbar/>
      </div>
      <div className='everyOneDiv-likedpost'>

        <div className='sidenavDIV'>
          <SideNavBarClose/>
        </div>
        
        <div className='card-container'>
          {
            likedPosts.map(post => (
              <div key={post._id} className='card-item'>
                <MuiCard title={post.title} createdBy={post.username} content={post.content} createdAt={post.createdAt} image={post.image} description={post.description}/>
              </div>
            ))
          }
        </div>
      </div>
      <div className='newNav-like'> 
        <BelowNavbar/>
      </div>
    </div>

  )
}
export default LikedPostSection