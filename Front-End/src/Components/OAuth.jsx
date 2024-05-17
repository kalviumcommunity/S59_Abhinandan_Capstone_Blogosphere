import React from 'react'
import '../Css/SignIn.css' 
import glogo from '../assets/Glogo.png';
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import {app} from '../../firebase'
import { useNavigate } from 'react-router-dom';

function OAuth() {

    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app); 
        provider.setCustomParameters({prompt : 'select_account'})
        try{
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('http://localhost:1111/user/Google', {
                method : 'POST',
                headers: {'Content-Type' : 'application/json'},
                credentials: 'include',
                body : JSON.stringify({
                    username : resultFromGoogle.user.displayName,
                    email : resultFromGoogle.user.email,
                    photo : resultFromGoogle.user.photoURL,
                }),
            })
            if(res.ok) {
                const data = await res.json();
                navigate('/')
            }
            else{
                console.error(res.error);
            }
        }
        catch (error){
            console.log(error);
        }

    }

  return (
    <button className='gBTN' type='button' onClick={handleGoogleClick}>
        <img src={glogo} alt="Google Logo" />
        <span>Continue with Google</span>
    </button>
  )
}

export default OAuth