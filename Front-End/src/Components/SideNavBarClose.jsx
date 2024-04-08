import React, { useState } from 'react';
import '../Css/SideNavBarClose.css';
import Dashboard from '../assets/Dashboard.png';
import search from '../assets/search.png';
import post from '../assets/post.png';
import like from '../assets/like.png';
import signOut from '../assets/logout.png';
import rightArr from '../assets/right-arrow.png';
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
                            <button className='snButtonsClose'>
                                <img src={Dashboard} className="sideNavIconsClose" alt="Dashboard" />
                            </button>
                            <button className='snButtonsClose'>
                                <img src={search} className="sideNavIconsClose" alt="Search" />
                            </button>
                            <button className='snButtonsClose'>
                                <img src={post} className="sideNavIconsClose" alt="Post" />
                            </button>
                            <button className='snButtonsClose'>
                                <img src={like} className="sideNavIconsClose" alt="Like" />
                            </button>
                        </div>
                        <div className='snBottomClose'>
                            <button className='snButtonsClose'>
                                <img src={signOut} className="sideNavIconsClose" alt="Sign Out" />
                            </button>
                        </div>
                    </div>
                    <button className='toggleBTNClose' onClick={toggleSideNav}>
                        <img src={rightArr} className="sideNavIconsClose" alt="Toggle" />
                    </button>
                </div>
            )}
        </>
    );
}

export default SideNavBarClose;
