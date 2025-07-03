import '../../styles/profileInfo.css';
import AddIcon from '@mui/icons-material/Add';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Fade, Slide, Snackbar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../../Context/AuthContext';
import Spinner from '../../Loader/Spinner';


function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function address() {

    const [open, setOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [addrId, setAddrId] = useState(null);
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const { getAddress, user, addAddress, updateAddress, deleteAddress } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        mobile: "",
        pincode: "",
        locality: "",
        area: "",
        city: "",
        state: "",
        addressType: "",
        landmark: "",
        alternate: ""

    });
    const [addresses, setAddresses] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }


    const saveChanges = async (Transition) => {
        try {
            if (!user?._id) return;
            let result = await addAddress(user._id, formData);
            if (result.success) {

                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
                setFormData({
                    fullname: "",
                    mobile: "",
                    pincode: "",
                    locality: "",
                    area: "",
                    city: "",
                    state: "",
                    addressType: "",
                    landmark: "",
                    alternate: ""
                });
                setOpen(!open);
            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            console.log(error);
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }

    const handleAddressUpdate = async (Transition) => {
        try {
            if (!user?._id) return;
            const result = await updateAddress(user._id, addrId, formData);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
                setFormData({
                    fullname: "",
                    mobile: "",
                    pincode: "",
                    locality: "",
                    area: "",
                    city: "",
                    state: "",
                    addressType: "",
                    landmark: "",
                    alternate: ""
                });
                setOpen(!open);
            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            console.log(error);
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }

    const handleAddressDelete = async (idx,Transition) => {
        try {
            if (!user?._id) return;
            let addressId = user.addresses[idx]._id;
            const result = await deleteAddress(user._id, addressId);
            console.log(result, addrId)
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
                setMoreOpen(false);
            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            console.log(error);
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }

    const handleEdit = (idx) => {
        try {
            const add = user.addresses[idx];
            console.log(add._id);
            setFormData(add);
            setOpen(true);
            setMoreOpen(false);
            setIsEditing(true);
            setAddrId(add._id);
        } catch (error) {
            console.log(error);
        }
    }
    const handleFormOpen = () => {
        setFormData({
            fullname: "",
            mobile: "",
            pincode: "",
            locality: "",
            area: "",
            city: "",
            state: "",
            addressType: "",
            landmark: "",
            alternate: ""
        });
        setOpen(!open);
    }                                     
    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        setLoading(true);
        let fetchaddress = async () => {
            try {
                if (!user?._id) return
                let result = await getAddress(user._id);

                if (result.success && Array.isArray(result.addresses)) {

                    setAddresses(result.addresses);
                }

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchaddress();

    }, [user])


    return (
        <div className='addressContainer'>
            <div className='mobileImage1' >
                <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg"
                    alt="" className='mx-3 mb-2' />
                <span style={{ textAlign: 'right', color: 'white', fontWeight: 'bold' }}>My addresses</span>
            </div>

            <div className="mobilehandler">
                <div className="mb-3 mobile">
                    <h6>Manage Addresses</h6>
                </div>
                <div className='address'>
                    <div style={{ display: open ? 'none' : '' }}>
                        <AddIcon sx={{ color: 'rgb(0, 132, 255)' }} />
                        <span className='ms-3 text-primary' style={{ fontSize: '0.95rem', fontWeight: '500' }} onClick={handleFormOpen}>Add A New Address</span>
                    </div>
                    <div style={{ display: open ? '' : 'none' }}>
                        <p className='ms-1 text-primary' style={{ fontSize: '0.95rem', fontWeight: '500' }}>{isEditing ? 'Update Address' : "Add a New Address"}</p>
                        <div>
                            <div className='d-flex'>
                                <div className='input-div'>
                                    <input type="text" name='fullname'
                                        className='name-input'
                                        required
                                        value={formData.fullname} onChange={handleChange} />
                                    <label htmlFor="fullname" className='name-label'>Name</label>
                                </div>
                                <div className='input-div ms-4'>
                                    <input type="number" name='mobile'
                                        className='name-input' value={formData.mobile} onChange={handleChange} />
                                    <label htmlFor="mobile" className='name-label'>10-digit mobile number</label>
                                </div>
                            </div>

                            <div className='d-flex mt-3'>
                                <div className='input-div'>
                                    <input type="number" name='pincode'
                                        className='name-input'

                                        value={formData.pincode} onChange={handleChange} />
                                    <label htmlFor="pincode" className='name-label'>Pincode</label>
                                </div>
                                <div className='input-div ms-4'>
                                    <input type="text"
                                        name='locality'
                                        required
                                        className='name-input' value={formData.locality} onChange={handleChange} />
                                    <label htmlFor="locality" className='name-label'>Locality</label>
                                </div>
                            </div>

                            <div className='d-flex mt-4'>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input type="text" name='area'
                                        className='name-input'
                                        required
                                        style={{ height: '5rem' }} value={formData.area} onChange={handleChange} />
                                    <label htmlFor="area" className='name-label'>Address(Area and Street)</label>
                                </div>
                            </div>

                            <div className='d-flex mt-3'>
                                <div className='input-div'>
                                    <input type="text" name='city'
                                        required
                                        className='name-input' value={formData.city} onChange={handleChange} />
                                    <label htmlFor="city" className='name-label'>City/District/Town</label>
                                </div>
                                <div className='input-div ms-4'>
                                    <input type="text"
                                        name='state'
                                        required
                                        className='name-input' value={formData.state} onChange={handleChange} />
                                    <label htmlFor="state" className='name-label'>State</label>
                                </div>
                            </div>

                            <div className='d-flex mt-3'>
                                <div className='input-div'>
                                    <input type="text" name='landmark'
                                        value={formData.landmark}
                                        onChange={handleChange}
                                        className='name-input' />
                                    <label htmlFor="landmark" className='name-label'>Landmark(Optional)</label>
                                </div>
                                <div className='input-div ms-4'>
                                    <input type="text" name='alternate'
                                        value={formData.alternate}
                                        onChange={handleChange}
                                        className='name-input' />
                                    <label htmlFor="alternate" className='name-label'>Alternate Phone(Optional)</label>
                                </div>
                            </div>

                            <div className="mt-3">
                                <FormControl>
                                    <p style={{ fontSize: '0.7rem', color: 'gray' }}>Address Type</p>
                                    <RadioGroup
                                        row
                                        name="addressType"
                                        value={formData.addressType}
                                        onChange={handleChange}
                                        sx={{ marginTop: '-0.5rem' }}
                                    >
                                        <FormControlLabel value='Home' name='addressType'
                                            required
                                            control={<Radio sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 17,
                                                },
                                            }} onClick={handleChange} />} label="Home" />
                                        <FormControlLabel value="Office"
                                            name='addressType'
                                            required
                                            control={<Radio sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 17,
                                                },
                                            }} onClick={handleChange} />} label="Office" />
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            <div className='mt-3'>
                                <div className='d-flex'>
                                    <button className='btn btn-primary' style={{ width: '9rem' }} onClick={() => { isEditing ? handleAddressUpdate(SlideTransition) : saveChanges(SlideTransition) }}>SAVE</button>
                                    <Button sx={{ marginLeft: '1rem' }} onClick={() => setOpen(!open)}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {loading ? <Spinner /> : (
                    <div className='mt-4'>
                        {addresses.length === 0 ? <p>No Address found. Please add a new address</p>
                            : addresses.map((add, idx) => {
                                return (
                                    <div key={idx} style={{ border: '1px solid gainsboro', padding: '1rem', backgroundColor: 'white' }}>
                                        <div className='d-flex justify-content-between'>
                                            <p className='addressType'>{add.addressType}</p>
                                            {moreOpen === idx ? (
                                                <div
                                                    className='addressEdit'
                                                    onMouseLeave={() => setMoreOpen(null)}
                                                >
                                                    <p onClick={() => handleEdit(idx)}>Edit</p>
                                                    <p onClick={()=>handleAddressDelete(idx,SlideTransition)}>Delete</p>
                                                </div>
                                            ) : (
                                                <div onMouseEnter={() => setMoreOpen(idx)}>
                                                    <MoreVertIcon />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <span>{add.fullname}</span>
                                            <span className='ms-5' style={{ fontWeight: '600' }}>{add.mobile}</span>
                                        </div>
                                        <div>
                                            <span> {add.locality},{add.city}, {add.state}</span>
                                            <span style={{ fontWeight: '600' }}>- {add.pincode}</span>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                )}
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