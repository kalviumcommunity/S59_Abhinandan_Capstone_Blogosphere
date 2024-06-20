import React from 'react'
import '../Css/Home.css'
import Navbar from '../Components/Navbar'
import SideNavBarClose from '../Components/SideNavBarClose'
import PostsComponent from '../Components/PostsComponent';
import BelowNavbar from '../Components/BelowNavbar';
function Home() {
  return (
    <div className='top-mostDiv'>
      <div>
        <Navbar/>
      </div>
      <div className='everyOneDiv'>

        <div className='div-for-sideNav'>
          <SideNavBarClose/>
        </div>
        
        <div className='component-container-div'>
          <PostsComponent/>
        </div>
      </div>
      <div className='newNav'> 
        <BelowNavbar/>
      </div>
    </div>
  )
}

export default Home