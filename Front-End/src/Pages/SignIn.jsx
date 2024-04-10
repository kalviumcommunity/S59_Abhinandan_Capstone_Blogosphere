import React from 'react'
import { Link } from 'react-router-dom'
import '../Css/SignIn.css'
import glogo from '../assets/Glogo.png'
function SignIn() {
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
            <div className='right-cont'>
                    <input type="text" className='inputFields' placeholder='Email'/>
                    <input type="text" className='inputFields' placeholder='Password'/>
                    <button className='inBTN'>Sign In</button>
                    <div className='gBTN'>
                        <img src={glogo} />
                        <span>Sign In with Google</span>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default SignIn