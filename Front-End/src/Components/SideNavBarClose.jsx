import React, { useEffect, useState } from 'react';
import '../Css/SideNavBarClose.css';
import Dashboard from '../assets/Dashboard.png';
import search from '../assets/search.png';
import post from '../assets/post.png';
import like from '../assets/like.png';
import signOut from '../assets/logout.png';
import menu from '../assets/menu.png'
import SideNavBarOpen from './SideNavBarOpen';
import { Tooltip } from '@mui/material';

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
                            <Tooltip  placement="right-start" title="Dashboard" arrow>
                                <button className='snButtonsClose'>
                                    <img src={Dashboard} className="sideNavIconsClose" alt="Dashboard" />
                                </button>
                            </Tooltip>
                            <Tooltip  placement="right-start" title="Search" arrow>
                                <button className='snButtonsClose' >
                                    <img src={search} className="sideNavIconsClose" alt="Search" />
                                </button>
                            </Tooltip>
                            <Tooltip  placement="right-start" title="Posts" arrow>
                                <button className='snButtonsClose' >
                                    <img src={post} className="sideNavIconsClose" alt="Post" />
                                </button>
                            </Tooltip>
                            <Tooltip  placement="right-start" title="Liked Posts" arrow>
                                <button className='snButtonsClose'>
                                    <img src={like} className="sideNavIconsClose" alt="Like" />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SideNavBarClose;
