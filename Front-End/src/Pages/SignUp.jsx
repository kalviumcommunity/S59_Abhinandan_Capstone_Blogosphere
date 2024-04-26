import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../Css/SignUp.css'
import glogo from '../assets/Glogo.png'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 
import Navbar from '../Components/Navbar'


function SignUp() {

    const [userFormData, setUserFormData] = useState({})

    const handleChange = (e) => {
        setUserFormData({...userFormData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (userFormData) {

                const res = await fetch('http://localhost:1111/user/signUp', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                 body: JSON.stringify(userFormData)
                });
                const {message} = await res.json();
                if (res.ok) {
                    setUserFormData({})
                    document.getElementById("username").value = "";
                    document.getElementById("email").value = "";
                    document.getElementById("password").value = "";
                    toast.success("User Registered Successfully")
                }
                else{
                    toast.error(message)
                }
            }
        } 
        catch (error) {
            console.log(`An error was caught, ${error}`)
        }
    };
    

    console.log(userFormData)
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
                <input type="text" className='inputFieldsUp' placeholder='UserName' id="username" onChange = {handleChange}/>
                <input type="text" className='inputFieldsUp' placeholder='Email' id="email" onChange = {handleChange}/>
                <input type="password" className='inputFieldsUp' placeholder='Password' id="password" onChange = {handleChange}/>
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