import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../Css/Navbar.css';
import logo from '../assets/logo.png';
import logoIcon from '../assets/logoIcon.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'
function Navbar() {
    const [username, setUsername] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND}/user/profile`, {
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const responseData = await response.json(); 
                    console.log(responseData)
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

    const handleLogout = () => {
        setUsername('');
        toast.success('Successfully logged out!');
        console.log('Logged out'); 
        Cookies.remove('token')
        Cookies.remove('username')
        setTimeout(() => {
            navigate('/signIn')
        }, 2000);
    }


    return (
        <div>
            <div className='navbar'>
                <NavLink to={'/'}><img src={logo} className='logo' alt='Blogosphere Logo' /></NavLink>
                <img src={logoIcon} className='logoIcon' alt='Blogosphere Logo' />
                {username ? (
                    <div className='log-right'>
                        <div className='lrbtns'>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/'}><button className='HABTN'>Home</button></NavLink>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/about'}><button className='HABTN'>About</button></NavLink>
                            <NavLink style={{textDecoration: "none", color: "black"}} to={'/createNewBlog'}><button className='createPostBtn'>Create Post</button></NavLink>
                            <img src={profilePic} alt="profileicon" className='profile-pic'  onClick={togglePopup}  />
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
