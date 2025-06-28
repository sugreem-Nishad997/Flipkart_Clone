import { useState, useEffect, useContext } from 'react';
import {useNavigate} from 'react-router-dom'
import '../styles/authentication.css';
import {
    TextField, FormControl, InputLabel, FilledInput, InputAdornment,
    IconButton, Snackbar, Slide, Fade, Button,
    Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../Context/AuthContext';
import Spinner from '../Loader/Spinner';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function authentication() {
    const [formState, setFormState] = useState(false);
    const [open, setOpen] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [showPass, setShowPass] = useState(false);
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [loader, setLoader] = useState(false);
    const { register, verifyOtp, login } = useContext(AuthContext);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        otp: ''
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (Transition) => {
        const { fullName, email, password } = formData;

        if (!fullName || !email || !password) {
            setMessage({ ms: 'Please fill all fields before sending OTP', type: 'warning', color: 'orange' });
            setSnakeOpen({ open: true, Transition });
            return;
        }

        try {
            setLoader(true);
            const result = await register(fullName, email, password);
            setMessage({ ms: result.message, type: 'success', color: 'green' })
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
            setMessage({ ms: error.message, type: 'error', color: 'red' });
            setSnakeOpen({ open: true, Transition });
            console.log(error);
        } finally {
            setLoader(false)
        }
    };

    const handleSubmit = async (Transition) => {
        const { email, otp, password } = formData;
        if (formState) {
            if (!email || !otp || !password) {
                console.log("All fields required");
                setMessage({ ms: "All fields required", type: 'warning', color: 'orange' });
                setSnakeOpen({ open: true, Transition });
            } else {
                try {
                    setLoader(true);
                    const result = await verifyOtp(email, otp);

                    if (result.success) {
                        setMessage({ ms: result.message, type: 'success', color: 'green' });
                        setSnakeOpen({ open: true, Transition });
                        setFormState(false);
                        setFormData({
                            fullName: "",
                            email: "",
                            password: "",
                            otp: "",
                        });
                        setOtpOpen(false);
                    } else {
                        setMessage({ ms: result.message, type: 'error', color: 'red' });
                        setSnakeOpen({ open: true, Transition });
                    }

                } catch (error) {
                    console.log(error);
                    setMessage({ ms: error.message, type: 'error', color: 'red' });
                    setSnakeOpen({ open: true, Transition });
                } finally {
                    setLoader(false)
                }
            }
        } else {
            if (!email || !password) {
                console.log("All fields required");
                setMessage({ ms: "All fields required", type: 'warning', color: 'orange' });
                setSnakeOpen({ open: true, Transition });
            } else {
                try {
                    setLoader(true)
                    const result = await login(email, password);
                    if (result.success === false) {
                        setMessage({ ms: result.message, type: 'error', color: 'red' });
                        setSnakeOpen({ open: true, Transition });
                        navigate("/")

                    } else {
                        setMessage({ ms: result, type: 'success', color: 'green' });
                        setSnakeOpen({ open: true, Transition });
                        setFormData({
                            email: '',
                            password: ''
                        })
                    }
                } catch (error) {
                    setMessage({ ms: error.message, type: 'error', color: 'red' })
                    setSnakeOpen({ open: true, Transition });
                    console.log(error);
                } finally {
                    setLoader(false)
                }
            }
        }
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <div style={{ backgroundColor: '#f1f3f6', opacity: loader ? '0.4' : '1' }}>
            <div className="auth">
                <div className='imageContainer'>
                    <img src={formState ? "Screenshot.png" :
                        "Screenshot-1.png"} alt="" />
                </div>
                <div className='mobileImage' style={{
                    backgroundColor: 'rgb(30, 119, 235)',
                    paddingTop: '0.9rem'
                }}>
                    <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg"
                        alt=""
                        style={{ display: 'flex', justifySelf: 'center', marginBottom: '0.5rem' }} />
                </div>
                <div>
                    <div className='form'>
                        <div style={{ width: '23rem' }}>

                            {formState && (<div>
                                <TextField id="standard-basic"
                                    label="full name"
                                    name='fullName'
                                    variant="standard"
                                    value={formData.fullName}
                                    onChange={handleChange} required
                                />
                            </div>)}

                            <div className='mt-3 d-flex justify-content-between'>
                                <TextField id="standard-basic"
                                    label="Email"
                                    variant="standard"
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    onClick={() => setOpen(true)}
                                    required />
                                {open && formState && (
                                    <Button variant='outlined'
                                        sx={{ padding: '0', height: '2rem' }}
                                        onClick={() => handleSendOtp(SlideTransition)}>
                                        {timer > 0 ? `Resend in 0:${timer < 10 ? '0' + timer : timer}` : 'verify'}
                                    </Button>)}
                            </div>
                            <div className='mt-3'>
                                <FormControl sx={{ backgroundColor: 'white', width: '23ch' }} variant="filled">
                                    <InputLabel htmlFor="filled-adornment-password">{formState?'Create Password':'Password'}</InputLabel>
                                    <FilledInput
                                        id="filled-adornment-password"
                                        sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: 'white' } }}
                                        type={showPass ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        name='password'
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPass ? 'hide the password' : 'display the password'
                                                    }
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
                            {otpOpen && formState && (<div style={{ display: 'flex', marginTop: '0.9rem', }}>

                                <TextField id="standard-basic" label="Enter 4-digit OTP" name='otp' variant="standard" value={formData.otp} onChange={handleChange} />
                            </div>)}
                            {loader && (<Spinner />)}
                            <div>
                                <button className='button' onClick={() => handleSubmit(SlideTransition)}>{formState ? 'Continue' : 'Login'}</button>
                                <p onClick={() => (setFormState(!formState))} className='textLink'>{formState ? 'Existing User? Log in' : 'New to Flipkart? Create an Account'}</p>
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
                <Alert
                    onClose={handleClose}
                    severity={message.type}
                    variant='filled'
                    sx={{ color: 'white', backgroundColor: 'black', '& .MuiAlert-icon': { color: message.color } }}
                >
                    {message.ms}
                </Alert>
            </Snackbar>
        </div>
    )
}