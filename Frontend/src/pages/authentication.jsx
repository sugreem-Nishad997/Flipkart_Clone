import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/authentication.css';
import {
    TextField, FormControl, InputLabel, FilledInput, InputAdornment,
    IconButton, Snackbar, Slide, Fade, Button,
    Alert,
    Box
} from '@mui/material';
import { AlternateEmail, Visibility, VisibilityOff } from '@mui/icons-material';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../Context/AuthContext';
import Spinner from '../Loader/Spinner';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function Authentication() {
    const [formState, setFormState] = useState(false); // true = register, false = login
    const [otpLoginMode, setOtpLoginMode] = useState(false);
    const [open, setOpen] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [showPass, setShowPass] = useState(false);
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [loader, setLoader] = useState(false);
    const { register, verifyOtp, login, loginWithOtp, resendOtp, googleLogin} = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        otp: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (Transition) => {
        const { email, otp, password, fullName } = formData;

        if (otpLoginMode) {
            console.log('otpLogin', otpOpen);
            if (!email || (otpOpen && !otp)) {
                setMessage({ ms: "Email and OTP required", type: "warning", color: "orange" });
                setSnakeOpen({ open: true, Transition });
                return;
            }

            if (!otpOpen) {
                try {
                    setLoader(true);
                    const result = await loginWithOtp(email);
                    setMessage({ ms: result.message, type: 'success', color: 'green' });
                    setSnakeOpen({ open: true, Transition });

                    if (result.success) {
                        setOtpOpen(true);
                        setTimer(60);
                        const id = setInterval(() => {
                            setTimer(prev => {
                                if (prev === 1) {
                                    clearInterval(id);
                                    return 0;
                                }
                                return prev - 1;
                            });
                        }, 1000);
                        setIntervalId(id);
                    }
                } catch (error) {
                    setMessage({ ms: error?.response?.data?.message, type: 'error', color: 'red' });
                    setSnakeOpen({ open: true, Transition });
                } finally {
                    setLoader(false);
                }
            } else {
                try {
                    setLoader(true);
                    const result = await verifyOtp(email, otp);

                    if (result.success) {
                        setMessage({ ms: result.message, type: 'success', color: 'green' });
                        setSnakeOpen({ open: true, Transition });
                        setFormData({ email: "", otp: "" });
                        navigate("/");
                    } else {
                        setMessage({ ms: result.message, type: 'error', color: 'red' });
                        setSnakeOpen({ open: true, Transition });
                    }
                } catch (error) {
                    setMessage({ ms: error?.response?.data?.message, type: 'error', color: 'red' });
                    setSnakeOpen({ open: true, Transition });
                } finally {
                    setLoader(false);
                }
            }
            return;
        }

        // email/password login/register
        console.log(formState);
        if (formState) {
            console.log("register", formState);
            if (!otpSent) {
                if (!email || !password || !fullName) {
                    setMessage({ ms: 'Please fill all fields before sending OTP', type: 'warning', color: 'orange' });
                    setSnakeOpen({ open: true, Transition });
                    return;
                }

                try {
                    setLoader(true);
                    const result = await register(fullName, email, password);
                    setMessage({ ms: result.message, type: 'success', color: 'green' });
                    setSnakeOpen({ open: true, Transition });

                    if (result.success) {
                        setOtpOpen(true);
                        setOpen(false);
                        setOtpSent(true);
                        setTimer(60);
                        const id = setInterval(() => {
                            setTimer(prev => {
                                if (prev === 1) {
                                    clearInterval(id);
                                    return 0;
                                }
                                return prev - 1;
                            });
                        }, 1000);
                        setIntervalId(id);
                    }
                } catch (error) {
                    setMessage({ ms: error?.response?.data?.message, type: 'error', color: 'red' });
                    setSnakeOpen({ open: true, Transition });
                } finally {
                    setLoader(false);
                }
            } else {
                try {
                    setLoader(true);
                    const result = await verifyOtp(email, otp);

                    if (result.success) {
                        setMessage({ ms: result.message, type: 'success', color: 'green' });
                        setSnakeOpen({ open: true, Transition });
                        setFormData({ email: "", otp: "", fullName: "", password: "" });
                        setFormState(false);
                        setOtpOpen(false);
                    } else {
                        setMessage({ ms: result.message, type: 'error', color: 'red' });
                        setSnakeOpen({ open: true, Transition });
                    }
                } catch (error) {
                    setMessage({ ms: error?.response?.data?.message, type: 'error', color: 'red' });
                    setSnakeOpen({ open: true, Transition });
                } finally {
                    setLoader(false);
                }
            }

        } else {
            if (!email || !password) {
                setMessage({ ms: "All fields required", type: 'warning', color: 'orange' });
                setSnakeOpen({ open: true, Transition });
            } else {
                try {
                    console.log("login");
                    console.log(email);
                    setLoader(true);
                    const result = await login(email, password);
                    console.log(result)
                    if (!result.success) {
                        setMessage({ ms: result.message, type: 'error', color: 'red' });
                        setSnakeOpen({ open: true, Transition });
                    } else {
                        setMessage({ ms: result, type: 'success', color: 'green' });
                        setSnakeOpen({ open: true, Transition });
                        setFormData({ email: '', password: '' });
                        navigate("/");
                    }
                } catch (error) {
                    setMessage({ ms: error?.response?.data?.message, type: 'error', color: 'red' });
                    setSnakeOpen({ open: true, Transition });
                } finally {
                    setLoader(false);
                }
            }
        }
    };

    const handleResend = async (Transition) => {
        try {
            setLoader(true);
            const { email } = formData;
            const result = await resendOtp(email);
            if (result.success) {
                setMessage({ ms: result.message, type: 'success', color: 'green' });
                setSnakeOpen({ open: true, Transition });
                if (intervalId) clearInterval(intervalId);
                setTimer(60);
                const id = setInterval(() => {
                    setTimer(prev => {
                        if (prev === 1) {
                            clearInterval(id);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                setIntervalId(id);
            } else {
                setMessage({ ms: result.message, type: 'error', color: 'red' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            setMessage({ ms: error?.response?.data?.message, type: 'error', color: 'red' });
            setSnakeOpen({ open: true, Transition });
        } finally {
            setLoader(false);
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await googleLogin(credentialResponse);
            if (response.success) {
                console.log('login');
                navigate("/");
            }else{
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleMouseDownPassword = (event) => event.preventDefault(credentialResponse);
    const handleMouseUpPassword = (event) => event.preventDefault();
    const handleClose = () => setSnakeOpen(prev => ({ ...prev, open: false }));

    useEffect(() => {
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [intervalId]);
    useEffect(() => {
        setFormData({
            fullName: "",
            email: "",
            password: "",
            otp: ""
        })
    }, [])

    return (
        <div style={{ backgroundColor: '#f1f3f6' }}>
            {loader && (<Spinner />)}
            <div className="auth" style={{ opacity: loader ? '0.4' : '1' }}>
                <div className='imageContainer'>
                    <img src={formState ? "Screenshot.png" : "Screenshot-1.png"} alt="" />
                </div>
                <div className='mobileImage' style={{
                    backgroundColor: 'rgb(30, 119, 235)',
                    paddingTop: '0.9rem'
                }}>
                    <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg"
                        alt="" style={{ display: 'flex', justifySelf: 'center', marginBottom: '0.5rem' }} />
                </div>
                <div>
                    <div className='form'>
                        <div style={{ width: '23rem' }}>
                            {formState && !otpLoginMode && (
                                <TextField label="Full Name" name='fullName' variant="standard"
                                    value={formData.fullName} onChange={handleChange} required />
                            )}

                            <div className='mt-3 d-flex justify-content-between'>
                                <TextField label="Email" name='email' variant="standard"
                                    value={formData.email} onChange={handleChange}
                                    onClick={() => {
                                        setOpen(true);
                                        setOtpOpen(false);
                                    }} required />
                                {(formState && open) && (
                                    <Button variant='outlined' sx={{ padding: '0', height: '2rem' }}
                                        onClick={() => handleSubmit(SlideTransition)}>
                                        verify
                                    </Button>
                                )}
                            </div>

                            {!otpLoginMode && (
                                <div className='mt-3'>
                                    <FormControl sx={{ backgroundColor: 'white', width: '23ch' }} variant="filled">
                                        <InputLabel>{formState ? 'Create Password' : 'Password'}</InputLabel>
                                        <FilledInput
                                            sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'white' } }}
                                            type={showPass ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            name='password'
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPass(!showPass)}
                                                        onMouseDown={handleMouseDownPassword}
                                                        onMouseUp={handleMouseUpPassword}
                                                        edge="end"
                                                    >
                                                        {showPass ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </div>
                            )}

                            {otpOpen && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TextField className="mt-3" label="Enter 4-digit OTP" name='otp' variant="standard"
                                        value={formData.otp} onChange={handleChange} />
                                    <Button
                                        onClick={() => handleResend(SlideTransition)}
                                        disabled={timer > 0}
                                        variant="text"
                                        sx={{ mt: 1 }}
                                    >
                                        {timer > 0 ? `Resend in 0:${timer < 10 ? '0' + timer : timer}` : 'Resend OTP'}
                                    </Button>
                                </div>

                            )}

                            <button className='button mt-3' onClick={() => handleSubmit(SlideTransition)}>
                                {formState ? 'Continue' : otpLoginMode ? (otpOpen ? 'Login' : 'Send OTP') : 'Login'}
                            </button>

                            <p className='textLink' onClick={() => {
                                setOtpLoginMode(false);
                                setFormState(!formState);
                            }}>
                                {formState ? 'Existing User? Log in' : 'New to Flipkart? Create an Account'}
                            </p>

                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>

                                <p style={{ margin: '1rem 0' }}>or</p>

                                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                    <Button variant='outlined'
                                        sx={{
                                            borderColor: '#bec0c2',
                                            color: 'black'
                                        }}
                                        onClick={() => {
                                            setOtpLoginMode(true);
                                            setFormState(false);
                                            setOtpOpen(false);
                                            setFormData({ email: "", otp: "" });
                                        }}
                                        startIcon={<AlternateEmail />}>
                                        Continue with email OTP
                                    </Button>
                                    {/* <Button
                                        variant="outlined"
                                        onClick={handleGoogleSuccess}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            textTransform: 'none',
                                            color: 'black',
                                            borderColor: '#bec0c2'
                                        }}
                                    >
                                        <img
                                            src="https://developers.google.com/identity/images/g-logo.png"
                                            alt="Google logo"
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        Continue with Google
                                    </Button> */}
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => console.log('Google Login Failed')}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => console.log("Facebook Login")}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            textTransform: 'none',
                                            color: 'black',
                                            borderColor: '#bec0c2'
                                        }}
                                    >
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                                            alt="Facebook logo"
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        Continue with Facebook
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snakeOpen.open}
                onClose={handleClose}
                slots={{ transition: snakeOpen.Transition }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key={snakeOpen.Transition.name}
                autoHideDuration={2200}
            >
                <Alert onClose={handleClose} severity={message.type} variant='filled'
                    sx={{ color: 'white', backgroundColor: 'black', '& .MuiAlert-icon': { color: message.color } }}>
                    {message.ms}
                </Alert>
            </Snackbar>
        </div>
    );
}
