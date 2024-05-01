import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../Css/Navbar.css';
import logo from '../assets/logo.png';
import user from '../assets/user.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar() {
    const [username, setUsername] = useState('');
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:1111/user/profile', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData)
                    if (responseData) {
                        setUsername(responseData.username);
                    } else {
                        console.error('Empty response data');
                    }
                } else {
                    setUsername('');
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
    
        fetchUserProfile();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:1111/user/logout', {
                credentials: 'include',
            });
            if (response.ok) {
                setUsername('');
                toast.success('Successfully logged out!');
            } else {
                console.error(`Cannot logout at this moment.`);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    return (
        <div>
            <div className='navbar'>
                <img src={logo} className='logo' alt='Blogosphere Logo' />
                <div className='navRight'>
                    <div className='navBTNS'>
                        <NavLink to={'/'}><span>Home</span></NavLink>
                        <span>About</span>
                    </div>
                    <div className='up-inBtns'>
                        {username ? (
                            <div className='username'>
                                <img src={user} className='userIcon' alt='User Icon' style={{ height: '2vw' }} />
                                <h3>{username}</h3>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <>
                                <NavLink to={'/signup'}><button className='sup'>Sign Up</button></NavLink>
                                <NavLink to={'/signin'}><button className='sin'>Sign In</button></NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Navbar;
