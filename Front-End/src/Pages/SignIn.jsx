import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/SignIn.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import glogo from '../assets/Glogo.png';
import OAuth from '../Components/OAuth';
import Navbar from '../Components/Navbar';
import { TextField } from '@mui/material';
import Cookies from 'js-cookie'

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        const res = await fetch(`${import.meta.env.VITE_BACKEND}/user/signIn`, {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (res.ok) {
          const { token, username } = await res.json();
          console.log('Token:', token);
          console.log('Username:', username);
          Cookies.set( `token`,token)
          Cookies.set( `username`,username)
          toast.success('Login Successful!');
          setShowPopup(true);
        } else {
          const { message } = await res.json();
          toast.error(message);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error('Login Failed. Please try again.');
      }
  };

  useEffect(() => {
    if (timer === 0) {
      navigate('/');
    }
  }, [timer, navigate]);

  return (
    <div className='signinContainer'>
      <Navbar />
      <div className='bothContainers'>
        <div className='left-cont'>
          <div>
            <h1>Sign In</h1>
            <h2>New to our website?</h2>
            <h3><Link style={{ textDecoration: 'underline', color: 'white' }} to={'/signup'}>Register</Link> right now!!</h3>
          </div>
        </div>
        <form className='right-cont' onSubmit={handleSubmit}>
          <TextField id='outlined-basic' label='Username' variant='outlined' className='inputFields' value={username} onChange={e => setUsername(e.target.value)} />
          <TextField id='outlined-basic' label='Password' variant='outlined' className='inputFields' value={password} onChange={e => setPassword(e.target.value)} type='password' />
          <button className='inBTN' type='submit'>Sign In</button>
          <OAuth />
        </form>
      </div>
      {showPopup && (
        <div className='overlay'>
          <div className='popup'>
            <h1>Logged In Successfully!</h1>
            <p>Redirecting to home in {timer} seconds...</p>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default SignIn;
