import { NavLink } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import '../Css/Navbar.css';
import logo from '../assets/logo.png';
import { LoginStatusContext } from '../App';
import user from '../assets/user.png'

function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginStatusContext);
    const [username, setUsername] = useState('');

    useEffect(() => {
            const storedUsername = sessionStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
    }, [isLoggedIn]);

    return (
        <div>
            <div className='navbar'>
                <img src={logo} className="logo" alt="Blogosphere Logo" />
                <div className='navRight'>
                    <div className='navBTNS'>
                        <NavLink to={'/'}><span>Home</span></NavLink>
                        <span>About</span>
                    </div>
                    <div className='up-inBtns'>
                        {username ? (
                            <div className='username'>
                                <p>{username}</p>
                                <img src={user} style={{height:"3vw"}} />   
                            </div>
                        ) : (
                            <>
                                <NavLink to={"/signup"}><button className='sup'>Sign Up</button></NavLink>
                                <NavLink to={"/signin"}><button className='sin'>Sign In</button></NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
