import React from 'react'
import '../Css/Home.css'
import Navbar from '../Components/Navbar'
import SideNavBarClose from '../Components/SideNavBarClose'
import PostsComponent from '../Components/PostsComponent';
import BelowNavbar from '../Components/BelowNavbar';
import Dashboard from '../Components/Dashboard'

function Home() {
  return (
    <div className='top-mostDiv-likedPost overflow-hidden h-screen flex flex-col'>
      <div>
        <Navbar/>
      </div>
      <div className='everyOneDiv-likedpost flex flex-row flex-1 overflow-hidden'>

        <div className='div-for-sideNav'>
          <SideNavBarClose/>
        </div>
          <Dashboard/>
      </div>
      <div className='newNav'> 
        <BelowNavbar/>
      </div>
    </div>
  )
}

export default Home