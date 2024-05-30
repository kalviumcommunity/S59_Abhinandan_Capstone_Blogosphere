import React from 'react';
import Navbar from '../Components/Navbar';
import SideNavBarClose from '../Components/SideNavBarClose';

function About() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <SideNavBarClose />
        </div>
        <div style={{ height: "calc(100vh - 8vw)", overflowY: "scroll", width: "100vw" }}>
          <div>About</div>
        </div>
      </div>
    </div>
  );
}

export default About;
