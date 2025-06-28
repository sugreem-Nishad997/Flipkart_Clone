import { Button, TextField } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import '../../styles/profileInfo.css';
import { AuthContext } from "../../Context/AuthContext";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Spinner from "../../Loader/Spinner";


export default function profileInfo() {
    const [nameEdit, setNameEdit] = useState(true);
    const [emailEdit, setEmailEdit] = useState(true);
    const [loading, setLoading] = useState(true);
    const [userForm, setUserForm] = useState({
        fullName: "",
        email: "",
        gender: ""
    })
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = () => {
            try {
                if (user) {
                    setUserForm({
                        fullName: user.name || '',
                        email: user.email || ''
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
            <div style={{ backgroundColor: 'white' }} className="p-5">
                <div className="mb-3 d-flex">
                    <h6>Personal Information</h6>
                    <span className="ms-5 edit" onClick={() => setNameEdit(!nameEdit)}>{nameEdit ? 'Edit' : 'Cancel'}</span>
                </div>
                <div className="d-flex">
                    <TextField id={nameEdit ? "outlined-basic" : "outlined-disabled"} variant="outlined" label={nameEdit ? "" : "Full Name"} value={userForm.fullName} disabled={nameEdit} size="small" name="fullName" />
                    {nameEdit ? "" : <Button variant="contained" className="ms-3" >save</Button>}
                </div>
                <div className="mt-3">
                    <FormControl>
                        <p style={{ fontSize: '0.8rem' }}>Your Gender</p>
                        <RadioGroup
                            row
                            name="row-radio-buttons-group"
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
                    <span className="ms-5 edit" onClick={() => setEmailEdit(!emailEdit)}>{emailEdit ? 'Edit' : 'Cancel'}</span>
                </div>
                <div className="d-flex">
                    <TextField id={emailEdit ? "outlined-basic" : "outlined-disabled"} variant="outlined" label={emailEdit ? "" : "Email"} value={userForm.email} disabled={emailEdit} size="small" name="email" type="email" />
                    {emailEdit ? "" : <Button variant="contained" className="ms-3" >save</Button>}
                </div>
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


        </div>
    )
}