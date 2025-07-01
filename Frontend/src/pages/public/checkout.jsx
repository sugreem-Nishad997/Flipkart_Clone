import { Button, Slide, TextField, Fade, Snackbar, Alert } from '@mui/material';
import '../../styles/checkout.css';
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Loader/Spinner';
import { AuthContext } from '../../Context/AuthContext';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function checkout() {

    const { logout, user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const [loginOpen, setLoginOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };

    const handleLogin = async (Transition) => {
        const { email, password } = formData;
        if (!email || !password) {
            console.log("All fields required");
            setMessage({ ms: "All fields required", type: 'warning', color: 'orange' });
            setSnakeOpen({ open: true, Transition });
        } else {
            try {
                const result = await login(email, password);
                if (result.success === false) {
                    setMessage({ ms: result.message, type: 'error', color: 'red' });
                    setSnakeOpen({ open: true, Transition });

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
            }
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1009); // Delay of 500ms
        if (user) {
            setUserData(user);
        } else {
            setUserData(null);
        }
        return () => clearTimeout(timer); // Clean up the timeout if component unmounts
    }, [user]);

    if (loading) return <Spinner />
    return (
        <div className='checkoutContainer' style={{ height: '100vh' }}>
            <div className='checkoutHeader'>
                <div style={{ height: '2.2rem' }} className='d-flex justify-content-around'>
                    <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg"
                        alt="" className='mt-2' />
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div className='checkoutBody'>
                <div>
                    <div className='buyingProcess'>
                        {userData && !loginOpen ? (<div className='loginStep'>
                            <div className='d-flex' style={{ columnGap: '0.4rem' }}>
                                <span className='number'>1</span>
                                <div>
                                    <p className='fw-bold text-secondary'>LOGIN<CheckIcon sx={{ color: '#2874f0', fontSize: '1.3rem', marginLeft: '0.2rem' }} /></p>
                                    <p style={{ marginTop: '-0.5rem', fontWeight: '500', fontSize: '0.88rem' }}>{userData ? userData.name : ''}</p>
                                </div>
                            </div>
                            <div>
                                <Button variant='outlined' size='small' onClick={() => setLoginOpen(!loginOpen)}>Change</Button>
                            </div>
                        </div>)
                            : (<div>
                                <div className="loginStep1">
                                    <div className='d-flex' style={{ columnGap: '0.4rem' }}>
                                        <span className='number'>1</span>
                                        <div>
                                            <p className='fw-bold text-white'>LOGIN<CheckIcon sx={{ color: '#2874f0', fontSize: '1.3rem', marginLeft: '0.2rem' }} /></p>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-3'>
                                    <div className='loginStep2'>
                                        <div className='d-flex flex-column' style={{ rowGap: '1rem' }}>
                                            {userData ? (
                                                <div className='d-flex flex-column' style={{ rowGap: '1rem' }}>
                                                    <span className='text-secondary'>Name: <span className='text-black'>{userData.name}</span></span>
                                                    <span>Phone</span>
                                                    <span className='text-primary' onClick={() => {
                                                        logout()
                                                        navigate("/")
                                                    }}>Logout & Sign in to another account</span>
                                                </div>
                                            ) : (
                                                <div className='d-flex flex-column' style={{ rowGap: '0.8rem' }}>
                                                    <TextField label="Email" variant='standard'
                                                        type='email'
                                                        name='email'
                                                        value={formData.email}
                                                        onChange={handleChange} />
                                                    <TextField label="Password" variant='standard'
                                                        type='password'
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange} />
                                                </div>
                                            )}
                                            <Button sx={{
                                                backgroundColor: '#d96e21', color: 'white', width: '20rem',
                                                padding: '0.7rem'
                                            }} onClick={() => userData ? (setLoginOpen(!loginOpen)) : (handleLogin(SlideTransition))}>{userData ? 'continue checkout' : 'cotinue'}</Button>
                                        </div>
                                        <div className='aboutLogin'>
                                            <p className='text-secondary'>Advantages of our secure login</p>
                                            <div className='d-flex flex-column' style={{ fontSize: '0.8rem', rowGap: '0.6rem' }}>
                                                <span><LocalShippingIcon sx={{ color: '#2874f0', marginRight: '0.5rem' }} />Easy Track Orders, Hassle Free Returns</span>
                                                <span><NotificationsIcon sx={{ color: '#2874f0', marginRight: '0.5rem' }} />Get Relevant Alerts and Recommendation</span>
                                                <span><StarRateIcon sx={{ color: '#2874f0', marginRight: '0.5rem' }} />Wishlist, Reviews, Ratings and more</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='desc text-secondary'>
                                        Please note that upon clicking "Logout" you will lose all items in cart and will be redirected to Flipkart home page.
                                    </div>
                                </div>
                            </div>)}
                    </div>
                    <div className='priceDetails'>
                        Price
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