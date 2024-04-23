import React, { useState } from 'react';
import '../Css/SideNavBarClose.css';
import Dashboard from '../assets/Dashboard.png';
import search from '../assets/search.png';
import post from '../assets/post.png';
import like from '../assets/like.png';
import signOut from '../assets/logout.png';
import menu from '../assets/menu.png'
import SideNavBarOpen from './SideNavBarOpen';

function SideNavBarClose() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSideNav = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            {isOpen ? (
                <SideNavBarOpen toggleSideNav={toggleSideNav}/>
            ) : (
                <div className='snContainerClose'>
                    <div className='sideNavClose'>
                        <div className='snTopClose'>
                            <button className=' toggle' title='Dashboard' onClick={toggleSideNav}>
                                <img src={menu} className="sideNavIconsClose" alt="Dashboard" />
                            </button>
                            <button className='toggle snButtonsClose' title='Dashboard'>
                                <img src={Dashboard} className="sideNavIconsClose" alt="Dashboard" />
                            </button>
                            <button className='snButtonsClose' title='Search'>
                                <img src={search} className="sideNavIconsClose" alt="Search" />
                            </button>
                            <button className='snButtonsClose' title='Posts'>
                                <img src={post} className="sideNavIconsClose" alt="Post" />
                            </button>
                            <button className='snButtonsClose' title='Liked Posts'>
                                <img src={like} className="sideNavIconsClose" alt="Like" />
                            </button>
                            <button className='snButtonsClose' title='Sign out'>
                                <img src={signOut} className="sideNavIconsClose" alt="Sign Out" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SideNavBarClose;
