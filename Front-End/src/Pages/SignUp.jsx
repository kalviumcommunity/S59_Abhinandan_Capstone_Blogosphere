import React from 'react'
import { Link } from 'react-router-dom'
import '../Css/SignUp.css'
import glogo from '../assets/Glogo.png'
import SignIn from './SignIn'
function SignUp() {
  return (
    <div className='signUpContainer'>
        <div className='bothUpContainers'>
            
            <div className='right-cont-Up'>
                    <input type="text" className='inputFieldsUp' placeholder='UserName'/>
                    <input type="text" className='inputFieldsUp' placeholder='Email'/>
                    <input type="password" className='inputFieldsUp' placeholder='Password'/>
                    <button className='inBTNup'>Sign In</button>
                    <div className='gBTNup'>
                        <img src={glogo} alt="Google logo"/>
                        <span>Sign In with Google</span>
                    </div>
            </div>

            <div className='left-cont-Up'>
                <div>
                    <h1>Register</h1>
                    <h2>Already a User ?</h2>
                    <h3><Link style = {{textDecoration:"underline", color:"white"}}to={'/signin'}>Sign In</Link> here!!</h3>
                </div>
            </div>

        </div>
    </div>
  )
}

export default SignUp