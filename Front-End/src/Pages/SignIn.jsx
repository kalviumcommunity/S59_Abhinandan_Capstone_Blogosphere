import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../Css/SignIn.css'
import glogo from '../assets/Glogo.png'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 

function SignIn() {

    const [loginFormData, setLoginFormData] = useState({});

    const handleChange = (e) => {
        setLoginFormData({...loginFormData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        console.log( JSON.stringify(loginFormData))
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:1111/user/signIn', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginFormData)
            });
            const {message} = await res.json();
            if (res.ok) {
                console.log(loginFormData)
                // setLoginFormData({})
                toast.success("Login Succesfull!!")
            }
            else {
                toast.error(message)
            }
        } catch (error) {
            console.log(`An error was caught, ${error}`)
            toast.error("Login Failed. Please try again.")
        }
    };

    // console.log(loginFormData)

  return (
    <div className='signinContainer'>
        <div className='bothContainers'>
            <div className='left-cont'>
                <div>
                    <h1>Sign In</h1>
                    <h2>New to our website?</h2>
                    <h3><Link style = {{textDecoration:"underline", color:"white"}}to={'/signup'}>Register</Link> right now!!</h3>
                </div>
            </div>
            <form className='right-cont' onSubmit={handleSubmit}>
                <input type="text" className='inputFields' id="login-username" placeholder='Username' onChange={handleChange}/>
                <input type="password" className='inputFields' id="login-password" placeholder='Password' onChange={handleChange}/>
                <button className='inBTN' type= "submit">Sign In</button>
                <div className='gBTN'>
                    <img src={glogo} />
                    <span>Sign In with Google</span>
                </div>
            </form> 
        </div>
        <ToastContainer/>
    </div>
  )
}

export default SignIn