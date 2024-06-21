import React from 'react';
import '../Css/SignIn.css';
import glogo from '../assets/Glogo.png';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';

function OAuth() {
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch(`${import.meta.env.VITE_BACKEND}/user/Google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          photo: resultFromGoogle.user.photoURL,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        document.cookie = `token=${data.token}; path=/; expires=${new Date(Date.now() + 24 * 3600000).toUTCString()}`;
        document.cookie = `username=${data.username}; path=/; expires=${new Date(Date.now() + 24 * 3600000).toUTCString()}`;
        navigate('/');
      } else {
        console.error('Failed to log in with Google:', res.statusText);
      }
    } catch (error) {
      console.error('An error occurred during Google sign-in:', error);
    }
  };

  return (
    <button className='gBTN' type='button' onClick={handleGoogleClick}>
      <img src={glogo} alt="Google Logo" />
      <span>Continue with Google</span>
    </button>
  );
}

export default OAuth;
