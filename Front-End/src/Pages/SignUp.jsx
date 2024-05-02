import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import glogo from '../assets/Glogo.png';
import '../Css/SignUp.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const usernameRegex = /^[A-Z][a-zA-Z0-9]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameRegex.test(username)) {
            setUsernameError('Username should start with a capital letter');
            return;
        } else {
            setUsernameError('');
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return;
        } else {
            setEmailError('');
        }
        if (!passwordRegex.test(password)) {
            if (password.length < 8 || password.length > 15) {
                setPasswordError('Password must be between 8 and 15 characters');
            } else if (!/(?=.*[a-z])/.test(password)) {
                setPasswordError('Password must contain at least one lowercase letter');
            } else if (!/(?=.*[A-Z])/.test(password)) {
                setPasswordError('Password must contain at least one uppercase letter');
            } else if (!/(?=.*\d)/.test(password)) {
                setPasswordError('Password must contain at least one digit');
            } else if (!/(?=.*[@$!%*?&])/.test(password)) {
                setPasswordError('Password must contain at least one special character');
            }
            return;
        } else {
            setPasswordError('');
        }

        try {
            const res = await fetch('http://localhost:1111/user/signUp', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                console.log('User registered successfully:', data);
                toast.success('User registered successfully')
                navigate('/signIn');
            } else {
                const { message } = await res.json();
                if (res.status === 400 && message === 'Username already exists') {
                    setUsernameError('Username already exists');
                } else {
                    toast.error(message || 'Something went wrong');
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error('Failed to register. Please try again later.');
        }
    };

    return (
        <div className='signUpContainer'>
            <Navbar />
            <div className='bothUpContainers'>
                <div className='left-cont-Up'>
                    <div>
                        <h1>Register</h1>
                        <h2>Already a User ?</h2>
                        <h3>
                            <Link style={{ textDecoration: 'underline', color: 'white' }} to={'/signin'}>
                                Sign In
                            </Link>{' '}
                            here!!
                        </h3>
                    </div>
                </div>
                <form action='' className='right-cont-Up' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        className='inputFieldsUp'
                        placeholder='UserName'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {usernameError && <span className="error">{usernameError}</span>}
                    <input
                        type='text'
                        className='inputFieldsUp'
                        placeholder='Email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <span className="error">{emailError}</span>}
                    <input
                        type='password'
                        className='inputFieldsUp'
                        placeholder='Password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <span className="error">{passwordError}</span>}
                    <button className='inBTNup' type='submit'>
                        Sign Up
                    </button>
                    <div className='gBTNup'>
                        <img src={glogo} alt='Google logo' />
                        <span>Sign In with Google</span>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SignUp;
