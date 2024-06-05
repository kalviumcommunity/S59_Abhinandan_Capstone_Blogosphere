import React from 'react';
import '../Css/SideNavBarOpen.css';
import Dashboard from '../assets/Dashboard.png';
import search from '../assets/search.png';
import post from '../assets/post.png';
import like from '../assets/like.png';
import signOut from '../assets/logout.png';
import menu from '../assets/menu.png'
import { NavLink } from 'react-router-dom';

function SideNavBarOpen({ toggleSideNav}) {
    
  const handleClick = () => {
    toggleSideNav();
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
          <NavLink to='/' style={{textDecoration:"none"}}>
            <button className='snButtons' title='Posts'>
              <img src={post} className="sideNavIcons" alt="Post" />
              <span>Posts</span>
            </button>
          </NavLink>
          <NavLink to='/likedPost' style={{textDecoration:"none"}}>
            <button className='snButtons' title='Liked Posts'>
              <img src={like} className="sideNavIcons" alt="Like" />
              <span>Liked Posts</span>
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SideNavBarOpen;
