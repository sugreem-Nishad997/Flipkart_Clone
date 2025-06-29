import { Alert, Box, Button, CircularProgress, Snackbar, TextField } from "@mui/material";
import { useState, useContext, useEffect, useRef } from "react";
import '../../styles/profileInfo.css';
import { AuthContext } from "../../Context/AuthContext";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Spinner from "../../Loader/Spinner";
import { Fade, Slide } from "@mui/material";


function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function profileInfo() {
    const [nameEdit, setNameEdit] = useState(true);
    const [emailEdit, setEmailEdit] = useState(true);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const timer = useRef(undefined);
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        gender: ""
    });
    const { user, updateName, updateEmail, verifyOtp } = useContext(AuthContext);

    const handleChange = (e) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value });
    }

    const handlePersonalInfo = async (Transition) => {
        try {
            setButtonLoading(true);
            const result = await updateName(user._id, userForm);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                timer.current = setTimeout(() => {
                    setNameEdit(true);
                    setButtonLoading(false);
                    setSnakeOpen({ open: true, Transition });
                }, 2000);
            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        } finally {
            setButtonLoading(false);
        }
    }

    const handleEmailUpdate = async (Transition) => {
        try {
            setButtonLoading(true);
            const result = await updateEmail(user._id, userForm);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                timer.current = setTimeout(() => {
                    setSnakeOpen({ open: true, Transition });
                    setEmailEdit(true);
                    setOtpSent(true);
                    setButtonLoading(false);
                }, 2000);

            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        } finally {
            setButtonLoading(false)
        }
    }

    const handleOtpVerify = async (Transition) => {
        try {
            setButtonLoading(true);
            const email = userForm.email;
            const result = await verifyOtp(email, otp);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                timer.current = setTimeout(() => {
                    setSnakeOpen({ open: true, Transition });
                    setEmailEdit(true);
                    setOtpSent(false);
                    setButtonLoading(false);
                }, 2000);

            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
        finally {
            setButtonLoading(false);
        }
    }

    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        const fetchData = () => {
            try {
                if (user) {
                    setUserForm({
                        name: user.name || '',
                        email: user.email || '',
                        gender: user.gender || ''
                    });
                } else {
                    console.log(user);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [user])

    if (loading) return (<Spinner />)

    return (
        <div style={{ backgroundColor: 'rgb(234, 240, 245)', padding: '0.9rem' }} className="personalInfo">
            <div className='mobileImage' style={{
                backgroundColor: 'rgb(30, 119, 235)',
                paddingTop: '1.2rem'
            }}>
                <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg"
                    alt=""
                    style={{ display: 'flex', justifySelf: 'center', marginBottom: '0.5rem' }} />
            </div>
            <div style={{ backgroundColor: 'white' }}
                className="p-5">
                <div className="mb-3 d-flex">
                    <h6>Personal Information</h6>
                    <span className="ms-5 edit"
                        onClick={() => setNameEdit(!nameEdit)}>
                        {nameEdit ? 'Edit' : 'Cancel'}</span>
                </div>
                <div className="d-flex">
                    <TextField id={nameEdit ? "outlined-basic" : "outlined-disabled"}
                        variant="outlined"
                        label={nameEdit ? "" : "Full Name"}
                        value={userForm.name}
                        onChange={handleChange}
                        disabled={nameEdit} size="small" name="name" />
                    {nameEdit ? "" :
                        <Box>
                            <Button variant="contained"
                                className="ms-3"
                                disabled={buttonLoading}
                                onClick={() => handlePersonalInfo(SlideTransition)}>save</Button>
                            {buttonLoading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: 'green',
                                        position: 'relative',
                                        top: {
                                            xs: '-1.8rem',
                                            sm: '0.4rem',
                                            md: '0.3rem',
                                        },
                                        left: {
                                            xs: '1.8rem',
                                            sm: '-2.8rem',
                                            md: '-3rem'
                                        },

                                    }}
                                />
                            )}
                        </Box>}
                </div>
                <div className="mt-3">
                    <FormControl>
                        <p style={{ fontSize: '0.8rem' }}>Your Gender</p>
                        <RadioGroup
                            row
                            name="gender"
                            value={userForm.gender}
                            onChange={handleChange}
                            sx={{ marginTop: '-0.5rem' }}
                        >
                            <FormControlLabel value="female" control={<Radio sx={{
                                '& .MuiSvgIcon-root': {
                                    fontSize: 19,
                                },
                            }} />} label="Female" disabled={nameEdit} />
                            <FormControlLabel value="male" control={<Radio sx={{
                                '& .MuiSvgIcon-root': {
                                    fontSize: 19,
                                },
                            }} />} label="Male" disabled={nameEdit} />
                        </RadioGroup>
                    </FormControl>

                </div>
                <div className="mb-3 d-flex mt-5">
                    <h6>Email Address</h6>
                    <span className="ms-5 edit"
                        onClick={() => setEmailEdit(!emailEdit)}>
                        {emailEdit ? 'Edit' : 'Cancel'}
                    </span>
                </div>
                <div className="d-flex">
                    <TextField id={emailEdit ? "outlined-basic" : "outlined-disabled"}
                        variant="outlined"
                        label={emailEdit ? "" : "Email"}
                        value={userForm.email}
                        onChange={handleChange}
                        disabled={emailEdit}
                        size="small"
                        name="email"
                        type="email" />
                    {emailEdit ? "" : <Box>
                        <Button variant="contained"
                            className="ms-3"
                            disabled={buttonLoading}
                            onClick={() => (handleEmailUpdate(SlideTransition))}>update</Button>
                        {buttonLoading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'green',
                                    position: 'relative',
                                    top: {
                                        xs: '-1.8rem',
                                        sm: '0.4rem',
                                        md: '0.3rem',
                                    },
                                    left: {
                                        xs: '1.8rem',
                                        sm: '-2.8rem',
                                        md: '-3rem'
                                    },

                                }}
                            />
                        )}
                    </Box>}
                </div>
                {otpSent && (<div className="d-flex mt-5">
                    <TextField id={emailEdit ? "outlined-basic" : "outlined-disabled"}
                        variant="outlined"
                        label="Enter 4-digit Code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        size="small"
                        name="otp" />
                    <Box>
                        <Button variant="contained"
                            className="ms-3"
                            disabled={buttonLoading}
                            onClick={() => (handleOtpVerify(SlideTransition))}>Verify</Button>
                        {buttonLoading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: 'green',
                                    position: 'relative',
                                    top: {
                                        xs: '-1.8rem',
                                        sm: '0.4rem',
                                        md: '0.3rem',
                                    },
                                    left: {
                                        xs: '1.8rem',
                                        sm: '-2.8rem',
                                        md: '-3rem'
                                    },

                                }}
                            />
                        )}
                    </Box>
                </div>)}
                <div className="mb-3 mt-5">
                    <h6 className="mb-3">FAQs</h6>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>What happens when I update my email address (or mobile number)?</p>
                    <p style={{ fontSize: '0.75rem' }}>Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>What happens to my existing Flipkart account when I update my email address (or mobile number)?</p>
                    <p style={{ fontSize: '0.75rem' }}>Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>When will my Flipkart account be updated with the new email address (or mobile number)?</p>
                    <p style={{ fontSize: '0.75rem' }}>It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes</p>
                </div>
                <div className="mt-5">
                    <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Delete Account</button>


                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Enter the following text to delte account <span className="text-danger">"DELETEMYACCOUNT"</span></h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form>

                                        <div class="mb-3">

                                            <textarea class="form-control" id="message-text"></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-danger">Delete</button>
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