import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../Css/Navbar.css';
import logo from '../assets/logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import CircleLoader from "react-spinners/CircleLoader";

function Navbar() {
    const [username, setUsername] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    console.log(profilePic)

    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:1111/user/profile', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Response Data:', responseData); 
                    if (responseData) {
                        setUsername(responseData.username);
                        setProfilePic(responseData.profilePicture);
                        setEmail(responseData.email)
                    } 
                    else {
                        console.error('Empty response data');
                    }
                } else {
                    setUsername('');
                    console.error('Failed to fetch user profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
            finally{
                setLoading(false)
            }
        }
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
                console.log('Logged out'); 
                setTimeout(() => {
                    navigate('/signIn')
                }, 2000);
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
                {username ? (
                    <div className='log-right'>
                        <div className='lrbtns'>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/'}><button className='HABTN'>Home</button></NavLink>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/about'}><button className='HABTN'>About</button></NavLink>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/createNewBlog'}><button className='createPostBtn'>Create Post</button></NavLink>
                            <img src={profilePic} alt="profileicon" style={{height:"2.8vw", borderRadius:'20px'}} onClick={togglePopup}  />
                        </div>
                    </div>
                ) : (
                    <div className='navRight'>
                        <div className='navBTNS'>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/'}><button className='HABTN'>Home</button></NavLink>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/about'}><button className='HABTN'>About</button></NavLink>
                        </div>
                        <div className='up-inBtns'>
                            <NavLink to={'/signup'}><button className='sup'>Sign Up</button></NavLink>
                            <NavLink to={'/signin'}><button className='sin'>Sign In</button></NavLink>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
            <div className={`profile-popup-modal ${showPopup ? 'show' : ''}`} onClick={(e)=> {
                if(e.target != e.currentTarget){
                    return;
                }
                setShowPopup(!showPopup);
            }}> 
                <div className='profile-popup-modal-content'>
                    <img src={profilePic} alt="profileicon" className="popup-profile-icon" />
                    <span className='popup-username'>{username}</span>
                    <p className='email'>{email}</p>
                    <button onClick={handleLogout} className='logout-popup-btn'>Logout</button>
                    <span className='choose'> Choose another account to login? <NavLink style={{textDecoration:"none"}} to={'/signin'}><span className='click'>Click here</span></NavLink></span>
                </div>
            </div>
            
        </div>
    );
}

export default Navbar;
