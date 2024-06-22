import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/SignIn.css';
import OAuth from '../Components/OAuth';
import Navbar from '../Components/Navbar';
import { TextField } from '@mui/material';
import Cookies from 'js-cookie'
import { SnackbarProvider, useSnackbar } from 'notistack';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(3);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
          Cookies.set('token', token, { expires: 1/24 }); 
          Cookies.set('username', username, { expires: 1/24 });
          enqueueSnackbar('Login Successful!', { variant: 'success' });
          setShowPopup(true);
        } 
        else {
          const { message } = await res.json();
          enqueueSnackbar(message, { variant: 'error' });
        }
      } 
      catch (error) {
        console.error('An error occurred:', error);
        enqueueSnackbar('Login Failed. Please try again.', { variant: 'error' });
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
    </div>
  );
}

export default function SignInWithSnackbar() {
  return (
    <SnackbarProvider maxSnack={3}>
      <SignIn />
    </SnackbarProvider>
  );
}