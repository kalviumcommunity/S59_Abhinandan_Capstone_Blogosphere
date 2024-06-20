import React from 'react'
import '../Css/Belownavbar.css'
import Dashboard from '../assets/Dashboard.png';
import search from '../assets/search.png';
import post from '../assets/post.png';
import like from '../assets/like.png';
import { NavLink } from 'react-router-dom';

function BelowNavbar() {
  return (
    <div className='below-box'>
        <NavLink to='/dashboard' >
            <div className='belowNavBTNS'>
                <img src={Dashboard} alt="dashboard Icon" className='icon' />
            </div>
        </NavLink>
        <div className='belowNavBTNS'>
            <img src={search} alt="search Icon" className='icon' />
        </div>
        <NavLink to='/' style={{textDecoration:"none"}}>
            <div className='belowNavBTNS'>
                <img src={post} alt="post Icon" className='icon' />
            </div>
        </NavLink>
        <NavLink to='/likedPost' style={{textDecoration:"none"}}>
            <div className='belowNavBTNS'>
                <img src={like} alt="like Icon" className='icon' />
            </div>
        </NavLink>
    </div>
  )
}

export default BelowNavbar