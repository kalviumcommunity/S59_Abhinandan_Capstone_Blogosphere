import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react';
import React from 'react'
import Navbar from '../Components/Navbar'
import SideNavBarClose from '../Components/SideNavBarClose'

function Home() {
  return (
    <div>
      <div>
        <Navbar/>
      </div>
      <div style={{display:"flex", flexDirection:"row", }}>
        <div>
          <SideNavBarClose/>
        </div>
        <div style={{height: "calc(100vh - 8vw)", overflowY: "scroll", width:"100vw"}}>
          other content
          <NavLink to = {'/createNewBlog'}><button>Create Post Button</button></NavLink>
        </div>
      </div>
    </div>
  )
}

export default Home