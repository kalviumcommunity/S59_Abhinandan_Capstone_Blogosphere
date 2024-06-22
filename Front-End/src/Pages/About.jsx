import React from 'react';
import Navbar from '../Components/Navbar';
import SideNavBarClose from '../Components/SideNavBarClose';

function About() {
  return (
    <div>  
        <div className='flex justify-center items-center ' style={{ height: "calc(100vh - 8vw)", overflowY: "scroll", width: "100vw" }}>
          <div className='bg-blue-500 p-4 rounded text-gray-700 font-bold font-sans'>About</div>
        </div>
    </div>
  );
}

export default About;
