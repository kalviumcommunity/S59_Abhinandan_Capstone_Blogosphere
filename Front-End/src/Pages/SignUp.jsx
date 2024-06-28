import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import '../Css/SignUp.css';
import OAuth from '../Components/OAuth';
import { TextField, Button } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

const OtpVerificationPopup = ({ showOtpPopup, handleOtpVerification, setOtpModalOpen }) => {
    const [otp, setOtp] = useState('');

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerifyClick = () => {
        handleOtpVerification(otp);
    };

    return (
        showOtpPopup && (
            <div className="modal" onClick={(e) => {
                if (e.target !== e.currentTarget) {
                    return;
                }
                setOtpModalOpen(false);
            }}>
                <div className="modal-content">
                    <p>Please enter the OTP sent to your email</p>
                    <TextField 
                        type="text" 
                        value={otp} 
                        onChange={handleOtpChange} 
                        placeholder="Enter OTP" 
                        fullWidth
                        variant="outlined"
                    />
                    <div className='otp-popup-btns'>
                        <Button 
                            onClick={handleVerifyClick} 
                            variant="contained" 
                            style={{ backgroundColor: '#26653e', color: '#fff' }}
                        >
                            Verify
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => setOtpModalOpen(false)} 
                            style={{ color: '#26653e', borderColor: '#26653e' }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
};

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [otpModalOpen, setOtpModalOpen] = useState(false); 
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const usernameRegex = /^[A-Z][a-zA-Z0-9]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameRegex.test(username)) {
            setUsernameError('Username should start with a capital letter');
            return;
        } 
        else {
            setUsernameError('');
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return;
        } 
        else {
            setEmailError('');
        }

        if (!passwordRegex.test(password)) {
            if (password.length < 8 || password.length > 15) {
                setPasswordError('Password must be between 8 and 15 characters');
            } 
            else if (!/(?=.*[a-z])/.test(password)) {
                setPasswordError('Password must contain at least one lowercase letter');
            } 
            else if (!/(?=.*[A-Z])/.test(password)) {
                setPasswordError('Password must contain at least one uppercase letter');
            } 
            else if (!/(?=.*\d)/.test(password)) {
                setPasswordError('Password must contain at least one digit');
            } 
            else if (!/(?=.*[@$!%*?&])/.test(password)) {
                setPasswordError('Password must contain at least one special character');
            }
            return;
        } else {
            setPasswordError('');
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND}/user/signUp`, {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                setOtpModalOpen(true);
                enqueueSnackbar('You will be redirected to the Sign in page on successful OTP verification.', { variant: 'info' }); // Show success message
            } 
            else {
                const { message } = await res.json();
                if (res.status === 400 && message === 'Username already exists') {
                    enqueueSnackbar('Username already exists', { variant: 'error' }); 
                } 
                else {
                    enqueueSnackbar(message || 'Something went wrong', { variant: 'error' }); 
                }
            }
        } 
        catch (error) {
            console.error('Error during registration:', error);
            enqueueSnackbar('Failed to register. Please try again later.', { variant: 'error' }); 

        }
    };

    const handleVerifyOTP = async (otp) => {
        try{
            const res = await fetch(`${import.meta.env.VITE_BACKEND}/user/verifyOTP`, {
                method: 'POST',
                body: JSON.stringify({ username, email, password, otp }),
                headers: { 'Content-Type': 'application/json' },
            });
            if(res.ok) {
                const data = await res.json();
                console.log('User registered successfully:', data);
                setOtpModalOpen(false);
                enqueueSnackbar('User registered Succesfully.', { variant: 'success' });
                setTimeout(()=>{
                    navigate('/signIn');
                },[1000]) 
            }
            else {
                const { message } = await res.json();
                enqueueSnackbar(message || 'Failed to verify OTP', { variant: 'error' }); 
            }
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            enqueueSnackbar('Failed to verify OTP. Please try again.', { variant: 'error' }); 

        }
    }

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
                    <Tooltip  placement="right-end" TransitionComponent={Fade} TransitionProps={{ timeout: 500 }} title='First letter in the username should be captial'>
                        <TextField id="outlined-basic" label="Username" variant="outlined" className='inputFieldsUp' value={username} onChange={e => setUsername(e.target.value)} />
                        {usernameError && <p className="error">{usernameError}</p>}
                    </Tooltip>

                    <TextField id="outlined-basic" label="Email" variant="outlined" className='inputFieldsUp' type='email' value={email} onChange={e => setEmail(e.target.value)} />
                    {emailError && <p className="error">{emailError}</p>}

                    <Tooltip  placement="right-end" TransitionComponent={Fade} TransitionProps={{ timeout: 500 }} title='A strong password should contain 8 to 15 characters, including uppercase letters, lowercase letters, numbers, and special characters.' arrow>
                        <TextField id="outlined-basic" label="Password" type='password' variant="outlined" className='inputFieldsUp' value={password} onChange={e => setPassword(e.target.value)} />
                        {passwordError && <p className="error">{passwordError}</p>}
                    </Tooltip>
                    <button className='inBTNup' type='submit'>Sign In</button>
                    
                    <OAuth/>
                </form>
            </div>
            <OtpVerificationPopup showOtpPopup={otpModalOpen} handleOtpVerification={handleVerifyOTP} setOtpModalOpen={setOtpModalOpen} />
        </div>
    );
}

export default function SignUpWithSnackbar() {
    return (
        <SnackbarProvider maxSnack={3}>
            <SignUp />
        </SnackbarProvider>
    );
}
