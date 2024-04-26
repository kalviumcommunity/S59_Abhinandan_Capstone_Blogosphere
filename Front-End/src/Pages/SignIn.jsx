import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/SignIn.css';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import glogo from '../assets/Glogo.png';
import Navbar from '../Components/Navbar';
import { LoginStatusContext } from '../App';

function SignIn() {
    const [loginFormData, setLoginFormData] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [timer, setTimer] = useState(5000);
    const {isLoggedIn, setIsLoggedIn} = useContext(LoginStatusContext)
    const navigate = useNavigate();

    console.log(isLoggedIn)

    useEffect(() => {
        let intervalId;
        if (showPopup) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [showPopup]);

    const handleChange = (e) => {
        setLoginFormData({ ...loginFormData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:1111/user/signIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginFormData)
            });
            const { message } = await res.json();
            if (res.ok) {
                sessionStorage.setItem('username', loginFormData['login-username']);
                setShowPopup(true);
                setIsLoggedIn(true);
            } else {
                toast.error(message);
                console.error(message);
            }
        } catch (error) {
            console.error(`An error was caught: ${error}`);
            toast.error("Login Failed. Please try again.");
        }
    };

    useEffect(() => {
        if (timer === 0) {
            navigate('/');
        }
    }, [timer, navigate]);

    return (
        <div className='signinContainer'>
            <Navbar/>
            <div className='bothContainers'>
                <div className='left-cont'>
                    <div>
                        <h1>Sign In</h1>
                        <h2>New to our website?</h2>
                        <h3><Link style={{ textDecoration: "underline", color: "white" }} to={'/signup'}>Register</Link> right now!!</h3>
                    </div>
                </div>
                <form className='right-cont' onSubmit={handleSubmit}>
                    <input type="text" className='inputFields' id="login-username" placeholder='Username' onChange={handleChange} />
                    <input type="password" className='inputFields' id="login-password" placeholder='Password' onChange={handleChange} />
                    <button className='inBTN' type="submit">Sign In</button>
                    <div className='gBTN'>
                        <img src={glogo} alt="Google Logo" />
                        <span>Sign In with Google</span>
                    </div>
                </form>
            </div>
            {showPopup && (
                <div className="overlay">
                    <div className="popup">
                        <h1>Logged In Successfully!</h1>
                        <p>Redirecting to home in {timer} seconds...</p>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );
}

export default SignIn;
