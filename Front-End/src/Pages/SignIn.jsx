import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/SignIn.css';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import glogo from '../assets/Glogo.png';
import Navbar from '../Components/Navbar';

function SignIn() {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [showPopup, setShowPopup] = useState(false);
    const [timer, setTimer] = useState(3);
    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;
        if (showPopup) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [showPopup]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:1111/user/signIn', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if(res.ok) {
                toast.success('Login Successful!');
                setShowPopup(true);
            } 
            else {
                toast.error('Wrong Credentials');
            }
        } 
        catch (error) {
            console.error('An error occurred:', error);
            toast.error('Login Failed. Please try again.');
        }
    }

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

                    <input type="text" 
                    className='inputFields' 
                    id="login-username" 
                    value={username} 
                    placeholder='Username' 
                    onChange={e => setUsername(e.target.value)} />

                    <input type="password" 
                    className='inputFields' 
                    id="login-password" value={password} 
                    placeholder='Password' 
                    onChange={e => setPassword(e.target.value)} />
                    
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
