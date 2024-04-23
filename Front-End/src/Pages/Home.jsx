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
        </div>
      </div>
    </div>
  )
}

export default Home