import { Link } from 'react-router-dom'
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
        <div style={{height: "calc(100vh - 8vw)", overflowY: "scroll"}}>
          other content 
          <Link to = {'/createNewBlog'}><button>Create Post Button</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Home