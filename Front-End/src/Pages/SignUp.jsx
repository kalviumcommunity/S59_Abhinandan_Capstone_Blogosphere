import React from 'react'
import { useState, use } from 'react'
import { Link } from 'react-router-dom'
import '../Css/SignUp.css'
import glogo from '../assets/Glogo.png'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'


function SignUp() {

    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:1111/user/signUp', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            
            if (res.ok) {
                const data = await res.json();
                console.log('User registered successfully:', data);
                toast.success("User registered successfully");
                setTimeout(() => {
                    navigate('/signIn'); 
                }, 1000);
            } 
            else {
                const { message } = await res.json();
                if (res.status === 400 && message === 'Username already exists') {
                    toast.error("Username already exists");
                } else {
                    toast.error(message || "Something went wrong");
                }
            }
        } 
        catch (error) {
            console.error('Error during registration:', error);
            toast.error("Failed to register. Please try again later.");
        }
    };

  return (
    <div className='signUpContainer'>
        <Navbar/>
        <div className='bothUpContainers'>
            
            <div className='left-cont-Up'>
                <div>
                    <h1>Register</h1>
                    <h2>Already a User ?</h2>
                    <h3><Link style = {{textDecoration:"underline", color:"white"}}to={'/signin'}>Sign In</Link> here!!</h3>
                </div>
            </div>
            <form action="" className='right-cont-Up' onSubmit={handleSubmit}>

                <input type="text" 
                className='inputFieldsUp' 
                placeholder='UserName' 
                id="username" 
                value={username} 
                onChange = {e => setUsername(e.target.value)}/>

                <input type="text"
                 className='inputFieldsUp'
                 placeholder='Email' 
                 id="email" value={email} 
                 onChange = {e => setEmail(e.target.value)}/>

                <input type="password" 
                className='inputFieldsUp' 
                placeholder='Password' 
                id="password" 
                value={password} 
                onChange = {e => setPassword(e.target.value)}/>

                <button className='inBTNup' type = "submit">Sign Up</button>

                <div className='gBTNup'>
                    <img src={glogo} alt="Google logo"/>
                    <span>Sign In with Google</span>
                </div>
            </form>

        </div>
        <ToastContainer/>
    </div>
  )
}

export default SignUp