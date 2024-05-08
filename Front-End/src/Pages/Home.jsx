import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react';
import React from 'react'
import Navbar from '../Components/Navbar'
import SideNavBarClose from '../Components/SideNavBarClose'
import PostsComponent from '../Components/PostsComponent';

function Home() {
  return (
    <div style={{overflow:'hidden'}}>
      <div>
        <Navbar/>
      </div>
      <div style={{display:"flex", flexDirection:"row", }}>
        <div>
          <SideNavBarClose/>
        </div>
        <div style={{height: "calc(100vh - 8vw)", overflowY: "scroll", width:"100vw"}}>
          <PostsComponent/>
        </div>
      </div>
    </div>
  )
}

export default Home