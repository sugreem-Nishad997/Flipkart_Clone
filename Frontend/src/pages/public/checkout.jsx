import { Button, Slide, TextField, Fade, Snackbar, Alert, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/checkout.css';
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Loader/Spinner';
import { AuthContext } from '../../Context/AuthContext';
import PaymentButton from '../client/PaymentButton';
import { KeyboardBackspace } from '@mui/icons-material';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function checkout() {

    const { logout, user, login, updateAddress, addAddress, getCartItems, removeFromCart } = useContext(AuthContext);
    const navigate = useNavigate();
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const [loginOpen, setLoginOpen] = useState(false);
    const [buttonOpen, setButtonOpen] = useState(false);
    const [addressOpen, setAddressOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editFormOpenId, setEditFormOpenId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [radioIdx, setRadioIdx] = useState(0);
    const [editAddress, setEditAddress] = useState(false);
    const [orderOpen, setOrderOpen] = useState(false);
    const [cartItems, setCartItems] = useState(null);
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [radioAddress, setRadioAddress] = useState("");
    const isFirstLoad = useRef(true)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [addressformData, setAddressFormData] = useState({
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressFormData((prevState) => ({ ...prevState, [name]: value }));
    }

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
                setMessage({ ms: error.response?.data?.message, type: 'error', color: 'red' })
                setSnakeOpen({ open: true, Transition });
                console.log(error);
            }
        }
    }

    const handleAddressUpdate = async (Transition, idx) => {
        try {
            if (!user?._id) return;
            const result = await updateAddress(user._id, user.addresses[idx]._id, addressformData);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
                setAddressFormData({
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
                setEditFormOpenId(null)
            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            console.log(error);
            setMessage({ ms: error?.response?.data?.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }

    const handleAddAddress = async (Transition) => {
        try {
            if (!userData?._id) return;
            let result = await addAddress(userData._id, addressformData);
            if (result.success) {

                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
                setRadioAddress(result.lastAdded)
                setAddressFormData({
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
                setFormOpen(false);
                setAddressOpen(false);

            } else {
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            console.log(error);
            setMessage({ ms: error?.response?.data?.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }

    const handleFormOpen = () => {
        setEditFormOpenId(null);
        setFormOpen(!formOpen);
        setEditAddress(!editAddress);
        setAddressFormData({
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
    }

    const handleRadioChange = (e) => {
        setRadioIdx(e.target.value);
        setButtonOpen(true);
    }

    const handleRemoveCart = async (idx, Transition) => {
        try {
            const product = cartItems[idx];
            const result = await removeFromCart(product);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
            } else {
                console.log(result);
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                setSnakeOpen({ open: true, Transition });
            }
        } catch (error) {
            setMessage({ ms: error?.response?.data?.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }

    const totals = cartItems && cartItems.reduce(
        (acc, item) => {
            const discountAmount = (item.price * item.discount) / 100;
            acc.totalPrice += item.price;
            acc.totalDiscount += discountAmount;
            acc.totalPayable += item.price - discountAmount;
            return acc;
        },
        { totalPrice: 0, totalDiscount: 0, totalPayable: 0 }
    );

    useEffect(() => {

        const initialize = async () => {
            if (user) {
                setUserData(user);
                setAddresses(user.addresses);
                if (user?.addresses.length > 0) {
                    if (isFirstLoad.current) {
                        setRadioAddress(user.addresses[0]);
                        setAddressOpen(true);
                        setRadioIdx(user.addresses[0]._id)
                        setButtonOpen(true)
                        isFirstLoad.current = false;
                    } else {
                        setRadioAddress(user.addresses[user.addresses.length - 1]);
                    }
                } else {
                    setFormOpen(true);
                    setAddressOpen(true);
                }

            } else {
                setUserData(null);
            }
            try {
                const result = await getCartItems();
                if (result.success) {
                    setCartItems(result.carts);
                } else {
                    console.log(result);
                }
            } catch (error) {
                setMessage({ ms: error?.response?.data?.message, color: 'red', type: 'error' });
                setSnakeOpen({ open: true, Transition });
            } finally {
                setLoading(false); // set loading to false only after everything is done
            }
        }
        initialize();
    }, [user]);
    if (loading) return <Spinner />
    return (
        <div className='checkoutContainer' style={{ height: '100vh' }}>
            <div className='checkoutHeader'>
                <div style={{ height: '2.2rem' }} className='d-flex justify-content-around'>
                    <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg"
                        alt="" className='mt-2' onClick={() => navigate("/")} />
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div className="mobileCheckoutHeader">
                <span className=' mx-1' onClick={()=>navigate(-1)}><KeyboardBackspace /></span>
                <span className='mx-3'>Order Summary</span>
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
                            : (<div style={{ backgroundColor: 'white', borderRadius: '2px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, .09)' }}>
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
                                                backgroundColor: '#f8641b', color: 'white', width: '20rem',
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
                        {/* Adress Step */}
                        {!addressOpen ? (<div className='loginStep'>
                            <div className='d-flex' style={{ columnGap: '0.4rem' }}>
                                <span className='number'>2</span>
                                <div>
                                    <p className='fw-bold text-secondary'>DELIVERY ADDRESS
                                        {userData && <CheckIcon sx={{ color: '#2874f0', fontSize: '1.3rem', marginLeft: '0.2rem' }} />
                                        }</p>
                                    {userData && radioAddress &&
                                        <p style={{ marginTop: '-0.5rem', fontWeight: '600', fontSize: '0.88rem' }}>{radioAddress.fullname}  <span style={{ fontWeight: '400' }}>{radioAddress.locality + " " + radioAddress.area + " " + radioAddress.state + " -  " + radioAddress.pincode}</span></p>}

                                </div>
                            </div>
                            {userData && <div>
                                <Button variant='outlined' size='small' onClick={() => {
                                    setAddressOpen(!addressOpen)
                                    setRadioIdx(radioAddress._id)
                                    setButtonOpen(true)
                                }}>Change</Button>
                            </div>}
                        </div>) :
                            (<div style={{ backgroundColor: 'white', borderRadius: '2px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, .09)' }}>
                                <div className="loginStep1">
                                    <div className='d-flex' style={{ columnGap: '0.4rem' }}>
                                        <span className='number'>2</span>
                                        <div>
                                            <p className='fw-bold text-white'>DELIVERY ADDRESS<CheckIcon sx={{ color: '#2874f0', fontSize: '1.3rem', marginLeft: '0.2rem' }} /></p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {(cartItems && cartItems.length === 0) && <p className='p-2' style={{backgroundColor:'#f0eaddff'}}>Your checkout has no items</p>}
                                    <FormControl>

                                        <RadioGroup
                                            row
                                            name="addresses"
                                            value={radioIdx}
                                            onChange={handleRadioChange}

                                            sx={{ marginTop: '-0.5rem', display: 'flex', flexDirection: 'column' }}
                                        >
                                            {addresses.map((add, idx) => {
                                                const addressId = add._id
                                                const isSelected = radioIdx === addressId

                                                return (
                                                    <div className='mappedAddress' key={idx}>
                                                        {editFormOpenId !== add._id ? <div className='d-flex' style={{ columnGap: '0.6rem' }}>
                                                            <FormControlLabel control={<Radio />}
                                                                value={addressId}
                                                                label={
                                                                    <div>
                                                                        <p className='fw-bold'>{add.fullname + "  "}<span style={{ color: 'gray', padding: '0.3rem', backgroundColor: '#f0f3f8' }}> {add.addressType} </span> {add.mobile}</p>
                                                                        <p style={{ marginTop: '0.5rem', fontWeight: '400', fontSize: '0.88rem', }}>{add.locality + " " + add.area + " " + add.state}<span style={{ fontWeight: '600' }}> - {add.pincode}</span></p>
                                                                        {buttonOpen && isSelected && (
                                                                            <Button
                                                                                variant='contained'
                                                                                sx={{ backgroundColor: '#f8641b' }}
                                                                                onClick={() => {
                                                                                    setRadioAddress(userData.addresses.find((add) => add._id === addressId)); // ✅ fixed
                                                                                    setAddressOpen(false);
                                                                                    setOrderOpen(true) // ✅ close the address step
                                                                                }}
                                                                            >
                                                                                deliver here
                                                                            </Button>
                                                                        )}

                                                                    </div>} />

                                                        </div> :
                                                            <div>
                                                                <p className='ms-1 text-primary' style={{ fontSize: '0.95rem', fontWeight: '500' }}>Update Address</p>
                                                                <div>
                                                                    <div className='d-flex'>
                                                                        <div className='input-div'>
                                                                            <input type="text" name='fullname'
                                                                                className='name-input'
                                                                                required
                                                                                value={addressformData.fullname} onChange={handleAddressChange} />
                                                                            <label htmlFor="fullname" className='name-label'>Name</label>
                                                                        </div>
                                                                        <div className='input-div ms-4'>
                                                                            <input type="number" name='mobile'
                                                                                className='name-input' value={addressformData.mobile} onChange={handleAddressChange} />
                                                                            <label htmlFor="mobile" className='name-label'>10-digit mobile number</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className='d-flex mt-3'>
                                                                        <div className='input-div'>
                                                                            <input type="number" name='pincode'
                                                                                className='name-input'

                                                                                value={addressformData.pincode} onChange={handleAddressChange} />
                                                                            <label htmlFor="pincode" className='name-label'>Pincode</label>
                                                                        </div>
                                                                        <div className='input-div ms-4'>
                                                                            <input type="text"
                                                                                name='locality'
                                                                                required
                                                                                className='name-input' value={addressformData.locality} onChange={handleAddressChange} />
                                                                            <label htmlFor="locality" className='name-label'>Locality</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className='d-flex mt-4'>
                                                                        <div style={{ position: 'relative', width: '100%' }}>
                                                                            <input type="text" name='area'
                                                                                className='name-input'
                                                                                required
                                                                                style={{ height: '5rem' }} value={addressformData.area} onChange={handleAddressChange} />
                                                                            <label htmlFor="area" className='name-label'>Address(Area and Street)</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className='d-flex mt-3'>
                                                                        <div className='input-div'>
                                                                            <input type="text" name='city'
                                                                                required
                                                                                className='name-input' value={addressformData.city} onChange={handleAddressChange} />
                                                                            <label htmlFor="city" className='name-label'>City/District/Town</label>
                                                                        </div>
                                                                        <div className='input-div ms-4'>
                                                                            <input type="text"
                                                                                name='state'
                                                                                required
                                                                                className='name-input' value={addressformData.state} onChange={handleAddressChange} />
                                                                            <label htmlFor="state" className='name-label'>State</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className='d-flex mt-3'>
                                                                        <div className='input-div'>
                                                                            <input type="text" name='landmark'
                                                                                value={addressformData.landmark}
                                                                                onChange={handleAddressChange}
                                                                                className='name-input' />
                                                                            <label htmlFor="landmark" className='name-label'>Landmark(Optional)</label>
                                                                        </div>
                                                                        <div className='input-div ms-4'>
                                                                            <input type="text" name='alternate'
                                                                                value={addressformData.alternate}
                                                                                onChange={handleAddressChange}
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
                                                                                value={addressformData.addressType}
                                                                                onChange={handleAddressChange}
                                                                                sx={{ marginTop: '-0.5rem' }}
                                                                            >
                                                                                <FormControlLabel value='Home' name='addressType'
                                                                                    required
                                                                                    control={<Radio sx={{
                                                                                        '& .MuiSvgIcon-root': {
                                                                                            fontSize: 17,
                                                                                        },
                                                                                    }} onClick={handleAddressChange} />} label="Home" />
                                                                                <FormControlLabel value="Office"
                                                                                    name='addressType'
                                                                                    required
                                                                                    control={<Radio sx={{
                                                                                        '& .MuiSvgIcon-root': {
                                                                                            fontSize: 17,
                                                                                        },
                                                                                    }} onClick={handleAddressChange} />} label="Office" />
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    </div>

                                                                    <div className='mt-3'>
                                                                        <div className='d-flex'>
                                                                            <Button variant='contained' sx={{ backgroundColor: '#f8641b' }} onClick={() => handleAddressUpdate(SlideTransition, idx)}>deliver here</Button>
                                                                            <Button sx={{ marginLeft: '1rem' }} onClick={() => setEditFormOpenId(null)}>Cancel</Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }

                                                        {!editFormOpenId && <Button sx={{ height: '2rem' }} onClick={() => {
                                                            setEditFormOpenId(add._id)
                                                            setAddressFormData(userData.addresses[idx])
                                                        }}>Edit</Button>}
                                                    </div>)
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                {formOpen &&
                                    <div>
                                        <p className='ms-1 text-primary' style={{ fontSize: '0.95rem', fontWeight: '500' }}>Add a New Address</p>
                                        <div>
                                            <div className='d-flex'>
                                                <div className='input-div'>
                                                    <input type="text" name='fullname'
                                                        className='name-input'
                                                        required
                                                        value={addressformData.fullname} onChange={handleAddressChange} />
                                                    <label htmlFor="fullname" className='name-label'>Name</label>
                                                </div>
                                                <div className='input-div ms-4'>
                                                    <input type="number" name='mobile'
                                                        className='name-input' value={addressformData.mobile} onChange={handleAddressChange} />
                                                    <label htmlFor="mobile" className='name-label'>10-digit mobile number</label>
                                                </div>
                                            </div>

                                            <div className='d-flex mt-3'>
                                                <div className='input-div'>
                                                    <input type="number" name='pincode'
                                                        className='name-input'

                                                        value={addressformData.pincode} onChange={handleAddressChange} />
                                                    <label htmlFor="pincode" className='name-label'>Pincode</label>
                                                </div>
                                                <div className='input-div ms-4'>
                                                    <input type="text"
                                                        name='locality'
                                                        required
                                                        className='name-input' value={addressformData.locality} onChange={handleAddressChange} />
                                                    <label htmlFor="locality" className='name-label'>Locality</label>
                                                </div>
                                            </div>

                                            <div className='d-flex mt-4'>
                                                <div style={{ position: 'relative', width: '100%' }}>
                                                    <input type="text" name='area'
                                                        className='name-input'
                                                        required
                                                        style={{ height: '5rem' }} value={addressformData.area} onChange={handleAddressChange} />
                                                    <label htmlFor="area" className='name-label'>Address(Area and Street)</label>
                                                </div>
                                            </div>

                                            <div className='d-flex mt-3'>
                                                <div className='input-div'>
                                                    <input type="text" name='city'
                                                        required
                                                        className='name-input' value={addressformData.city} onChange={handleAddressChange} />
                                                    <label htmlFor="city" className='name-label'>City/District/Town</label>
                                                </div>
                                                <div className='input-div ms-4'>
                                                    <input type="text"
                                                        name='state'
                                                        required
                                                        className='name-input' value={addressformData.state} onChange={handleAddressChange} />
                                                    <label htmlFor="state" className='name-label'>State</label>
                                                </div>
                                            </div>

                                            <div className='d-flex mt-3'>
                                                <div className='input-div'>
                                                    <input type="text" name='landmark'
                                                        value={addressformData.landmark}
                                                        onChange={handleAddressChange}
                                                        className='name-input' />
                                                    <label htmlFor="landmark" className='name-label'>Landmark(Optional)</label>
                                                </div>
                                                <div className='input-div ms-4'>
                                                    <input type="text" name='alternate'
                                                        value={addressformData.alternate}
                                                        onChange={handleAddressChange}
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
                                                        value={addressformData.addressType}
                                                        onChange={handleAddressChange}
                                                        sx={{ marginTop: '-0.5rem' }}
                                                    >
                                                        <FormControlLabel value='Home' name='addressType'
                                                            required
                                                            control={<Radio sx={{
                                                                '& .MuiSvgIcon-root': {
                                                                    fontSize: 17,
                                                                },
                                                            }} onClick={handleAddressChange} />} label="Home" />
                                                        <FormControlLabel value="Office"
                                                            name='addressType'
                                                            required
                                                            control={<Radio sx={{
                                                                '& .MuiSvgIcon-root': {
                                                                    fontSize: 17,
                                                                },
                                                            }} onClick={handleAddressChange} />} label="Office" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>

                                            <div className='mt-3'>
                                                <div className='d-flex'>
                                                    <Button variant='contained' sx={{ backgroundColor: '#f8641b' }} onClick={() => handleAddAddress(SlideTransition)}>deliver here</Button>
                                                    <Button sx={{ marginLeft: '1rem' }} onClick={() => setFormOpen(!formOpen)}>Cancel</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>}
                            </div>)}
                        {addressOpen && !formOpen && <div className='addressStep'>
                            <AddIcon sx={{ color: 'rgb(0, 132, 255)' }} />
                            <span className='ms-3 text-primary' style={{ fontSize: '0.95rem', fontWeight: '500' }} onClick={handleFormOpen}>Add A New Address</span>
                        </div>}

                        {/* Order Summary section */}

                        {!orderOpen  ? <div className='loginStep'>
                            <div className='d-flex' style={{ columnGap: '0.4rem' }}>
                                <span className='number'>3</span>
                                <div>
                                    <p className='fw-bold text-secondary'>ORDER SUMMARY
                                        {(userData && !addressOpen) && <CheckIcon sx={{ color: '#2874f0', fontSize: '1.3rem', marginLeft: '0.2rem' }} />
                                        }
                                    </p>
                                    {(userData && !addressOpen) && <p>{cartItems && cartItems.length} item</p>}
                                </div>
                            </div>
                            {(userData && !addressOpen) && <div>
                                <Button variant='outlined' size='small' onClick={() => setOrderOpen(!orderOpen)}>Change</Button>
                            </div>}
                        </div> : ( (cartItems && cartItems.length>0) &&
                            <div style={{ backgroundColor: 'white', borderRadius: '2px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, .09)' }}>
                                <div className="loginStep1">
                                    <div className='d-flex' style={{ columnGap: '0.4rem' }}>
                                        <span className='number'>3</span>
                                        <div>
                                            <p className='fw-bold text-white'>ORDER SUMMARY<CheckIcon sx={{ color: '#2874f0', fontSize: '1.3rem', marginLeft: '0.2rem' }} /></p>
                                        </div>

                                    </div>
                                </div>
                                <div className="cartsMap">
                                    {cartItems && cartItems.map((cart, idx) => {
                                        return (
                                            <div style={{ backgroundColor: 'white', borderRadius: '2px', borderBottom: '2px solid #f8f3f8', padding: '1rem' }} key={idx}>
                                                <div className="d-flex" style={{ columnGap: '1rem' }}>
                                                    <div style={{ padding: '0.5rem' }}>
                                                        <img src={cart.images[3].url} alt="" style={{ height: '5rem', width: '5rem', objectFit: 'contain' }} />
                                                    </div>

                                                    <div className="my-3">
                                                        <p className="fs-5" onClick={() => navigate(`/${cart._id}`)}>{cart.title}</p>

                                                        <span style={{ textDecoration: ' line-through', color: 'gray' }}>₹{cart.price}</span>
                                                        <span className="fw-bold fs-3 mx-2">₹{Math.round(cart.price - (cart.price * cart.discount / 100))}</span>
                                                        <span className="text-success fw-bold p-1">{cart.discount}%off</span>
                                                    </div>

                                                </div>
                                                <div style={{ marginLeft: "7rem" }}>
                                                    <Button color="red" size="small" variant="outlined" onClick={() => handleRemoveCart(idx, SlideTransition)}
                                                        sx={{ ':hover': { color: 'blue' } }}
                                                    >Remove</Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    
                        {(orderOpen ) ? <div style={{ backgroundColor: 'white', borderRadius: '2px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, .09)' }} >
                            <div className='d-flex justify-content-between p-3'>
                                <p style={{ fontSize: '0.88rem' }}>Order confirmation email sent to your {userData && userData.email}</p>
                                <Button variant='contained' sx={{ backgroundColor: '#f8641b', boxShadow: 'none' }} onClick={() => setOrderOpen(!orderOpen)} className='m-button'>Continue</Button>
                            </div>
                        </div> : (cartItems && cartItems.length === 0) &&<p className='p-2' style={{backgroundColor:'#e6dca1'}}>Your checkout has no items</p>}

                    </div>
                    {(userData && (cartItems && cartItems.length > 0)) && <div className='priceDetails'>
                        <p className='fw-bold text-secondary p-3' style={{ borderBottom: '2px solid rgb(235, 236, 236)' }}>PRICE DETAILS</p>
                        <div className='p-3' style={{ borderBottom: '2px dashed rgba(217, 218, 218, 1)' }} >
                            <div className="d-flex justify-content-between ">
                                <span>Price({cartItems && cartItems.length})</span>
                                <span>₹{totals && totals.totalPrice}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <span>Protect Promise Fee</span>
                                <span>₹166</span>
                            </div>

                        </div>
                        <div className='d-flex justify-content-between mt-3 fw-bold p-3 fs-5' style={{ borderBottom: '2px solid rgb(235, 236, 236)' }}>
                            <span>Total Payable</span>
                            <span>₹{Math.round(totals && totals.totalPayable + 166)}</span>
                        </div>
                        <p className='mt-3 text-success p-3' style={{ fontSize: "1.1rem", fontWeight: '500' }}>Your will save ₹{totals && totals.totalDiscount} on this Order</p>
                    </div>}
                </div>
                {(userData && (cartItems && cartItems.length > 0)) && <PaymentButton totals={totals} orderItems={cartItems} shippingInfo={radioAddress}/>}
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
        </div >
    )
}