import React from 'react';
import '../Css/SideNavBarOpen.css';
import Dashboard from '../assets/Dashboard.png';
import search from '../assets/search.png';
import post from '../assets/post.png';
import like from '../assets/like.png';
import signOut from '../assets/logout.png';
import menu from '../assets/menu.png'

function SideNavBarOpen({ toggleSideNav,username,setUsername}) {
    
  const handleClick = () => {
    toggleSideNav();
  }

  const handlelogout = () => {
    fetch('http://localhost:1111/user/logout', {
        credentials: 'include',
    })
    .then(response => {
        if (response.ok) {
            console.log('User logged out successfully');
            setUsername('')
        } 
        else {
            console.error('Logout failed:', response.statusText);
        }
    })
    .catch(error => {
            console.error('Error during logout:', error);
    });
}


  return (
    <div className='snContainer'>
      <div className='sideNav'>
        <div className='snTop'>
          <button className='toggleOpen' title='Dashboard' onClick={handleClick}>
            <img src={menu} className="sideNavIcons" alt="Dashboard" />
            <span>Close</span>
          </button>
          <button className='snButtons' title='Dashboard'>
            <img src={Dashboard} className="sideNavIcons" alt="Dashboard" />
            <span>Dashboard</span>
          </button>
          <button className='snButtons' title='Search'>
            <img src={search} className="sideNavIcons" alt="Search" />
            <span>Search</span>
          </button>
          <button className='snButtons' title='Posts'>
            <img src={post} className="sideNavIcons" alt="Post" />
            <span>Posts</span>
          </button>
          <button className='snButtons' title='Liked Posts'>
            <img src={like} className="sideNavIcons" alt="Like" />
            <span>Liked Posts</span>
          </button>
          <button className='snButtons' onClick={handlelogout}>
            <img src={signOut} className="sideNavIcons" alt="Logout" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideNavBarOpen;
