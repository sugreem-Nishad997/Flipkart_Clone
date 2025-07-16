import { Alert, Avatar, Button, Dialog, DialogTitle, Fade, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Slide, Snackbar } from "@mui/material";
import PropTypes from 'prop-types';
import '../../styles/cart.css';
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Spinner from "../../Loader/Spinner";
import { Add, Check, EditLocationAlt, Person, WhereToVote } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

//for Address Dialoge
function SimpleDialog(props) {
    const { onClose, selectedAddress, open, addresses, setSelectedAddress } = props;

    const handleClose = () => {
        onClose(selectedAddress);
    };

    const handleListItemClick = (value) => {
        setSelectedAddress(value); // update selected address

        setTimeout(() => {
            onClose(value); // close the dialog after delay
        }, 500); // ⏱ 500ms delay
    };


    return (
        <Dialog onClose={handleClose} open={open} >
            <DialogTitle>Set backup account</DialogTitle>
            <List sx={{ pt: 0 }}>
                {addresses.map((add, idx) => (
                    <ListItem disablePadding key={idx}>
                        <ListItemButton onClick={() => handleListItemClick(add)}>
                            <IconButton>
                                {selectedAddress._id === add._id ? <WhereToVote sx={{ color: blue[600], fontSize: '2.3rem' }} /> : <EditLocationAlt sx={{ fontSize: '1.6rem' }} />}
                            </IconButton>
                            <div>
                                <p className='fw-bold'>{add.fullname + "  "}<span style={{ color: 'gray', padding: '0.3rem', backgroundColor: '#f0f3f8' }}> {add.addressType} </span> {add.mobile}</p>
                                <p style={{ marginTop: '0.5rem', fontWeight: '400', fontSize: '0.88rem', }}>{add.locality + " " + add.area + " " + add.state}<span style={{ fontWeight: '600' }}> - {add.pincode}</span></p>
                            </div>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('addAccount')}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <Add />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add account" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedAddress: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]).isRequired,
    setSelectedAddress: PropTypes.func.isRequired,
    addresses: PropTypes.array.isRequired,
};


function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function cart() {
    const { user, getCartItems, removeFromCart } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [carts, setCarts] = useState([]);
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const [radioAddress, setRadioAddress] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const navigate = useNavigate();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedAddress(value);
        setRadioAddress(value)
    };

    const totals = carts && carts.reduce(
        (acc, item) => {
            const discountAmount = (item.price * item.discount) / 100;
            acc.totalPrice += item.price;
            acc.totalDiscount += discountAmount;
            acc.totalPayable += item.price - discountAmount;
            return acc;
        },
        { totalPrice: 0, totalDiscount: 0, totalPayable: 0 }
    );

    const handleRemoveCart = async (idx, Transition) => {
        try {
            const product = carts[idx];
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
            setMessage({ ms: error.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }
    const handleSnackeClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1019);
        if (user) {
            setUserData(user);
            setAddresses(user.addresses);
            if (user.addresses && user.addresses.length > 0) {
                setRadioAddress(user.addresses[0]);
                setSelectedAddress(user.addresses[0]);
            }

        } else {
            setUserData(null);
        }
        const fetchCartItems = async () => {
            try {
                const result = await getCartItems();
                if (result.success) {
                    setCarts(result.carts);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCartItems();
        return () => clearTimeout(timer);
    }, [user]);

    if (loading) return <Spinner />
    return (
        <div style={{ backgroundColor: 'rgb(248, 248, 248)' , padding:'1rem'}}>
            {!userData || (userData && carts.length === 0)? <div className="cartContainer">
                <div style={{ width: '15rem', height: '16rem' }}>
                    <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="" style={{ width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h5>{userData ? 'Your cart is empty!' :'Missing Cart Items'}</h5>
                    <p>{userData ? 'Add items to it now': 'Login to see the items you added previously'}</p>
                </div>
                <div>
                    <Button variant="contained" sx={{ backgroundColor: userData? 'rgba(54, 130, 245, 1)':'rgb(245, 102, 54)' }} size="large" onClick={() => userData?navigate("/"):navigate("/auth")}>{userData? 'Shop now':'Login'}</Button>
                </div>
            </div> :
                <div className="checkoutBody">
                    <div>
                        <div className="buyingProcess">
                            <div className="loginStep">
                                <div className='d-flex' style={{ columnGap: '0.4rem' }}>
                                    <div>
                                        <p>Deliver to: <span className="fw-bold">{userData && userData.name + " , " + radioAddress.pincode}</span>
                                            <span className="addressType">  {radioAddress.addressType}</span>
                                            {userData && <Check sx={{ color: '#2874f0', fontSize: '1.3rem', marginLeft: '0.2rem' }} />
                                            }
                                        </p>
                                        {userData && radioAddress &&
                                            <p style={{ marginTop: '-0.5rem', fontWeight: '400' }}>{radioAddress.locality + " " + radioAddress.area + " " + radioAddress.state}</p>}
                                    </div>
                                </div>
                                <div>
                                    <Button variant='outlined' size='small' onClick={handleClickOpen}>Change</Button>
                                </div>
                                <SimpleDialog
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                    addresses={addresses}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </div>
                            <div>
                                {carts && carts.map((cart, idx) => {
                                    return (
                                        <div style={{ backgroundColor: 'white', borderRadius: '2px', borderBottom: '2px solid #f8f3f8', padding: '1rem' }} key={idx}>
                                            <div className="d-flex" style={{ columnGap: '1rem' }}>
                                                <div style={{ height: '9rem', width: '9rem', padding: '0.5rem' }}>
                                                    <img src={cart.images[2]} alt="" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                                </div>

                                                <div className="my-3">
                                                    <p className="fs-5">{cart.title}</p>

                                                    <span style={{ textDecoration: ' line-through', color: 'gray' }}>₹{cart.price}</span>
                                                    <span className="fw-bold fs-3 mx-2">₹{cart.price - (cart.price * cart.discount / 100)}</span>
                                                    <span className="text-success fw-bold p-1">{cart.discount}%off</span>
                                                </div>
                                                <div style={{ marginLeft: "10rem" }}>
                                                    <Button color="red" size="small" variant="outlined" onClick={()=>handleRemoveCart(idx, SlideTransition)}>Remove</Button>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                            <div className="placeOrder">
                                <span>67</span>
                                <Button variant="contained" sx={{ backgroundColor: '#fb641b' }}>place order</Button>
                            </div>
                        </div>
                        <div className='priceDetails'>
                            <p className='fw-bold text-secondary p-3' style={{ borderBottom: '2px solid rgb(235, 236, 236)' }}>PRICE DETAILS</p>
                            <div className='p-3' style={{ borderBottom: '2px dashed rgba(217, 218, 218, 1)' }} >
                                <div className="d-flex justify-content-between ">
                                    <span>Price({ carts && carts.length})</span>
                                    <span>₹{totals && totals.totalPrice}</span>
                                </div>
                                <div className="d-flex justify-content-between my-4">
                                    <span>Discount</span>
                                    <span className="text-success">-₹{totals && totals.totalDiscount}</span>

                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Protect Promise Fee</span>
                                    <span>₹166</span>
                                </div>

                            </div>
                            <div className='d-flex justify-content-between mt-3 fw-bold p-3 fs-5' style={{ borderBottom: '2px solid rgb(235, 236, 236)' }}>
                                <span>Total Payable</span>
                                <span>₹{totals && totals.totalPayable + 166}</span>
                            </div>
                            <p className='mt-3 text-success p-3' style={{ fontSize: "1.1rem", fontWeight: '500' }}>Your will save ₹{totals && totals.totalDiscount} on this Order</p>
                        </div>
                    </div>
                </div>
            }
            <Snackbar
                open={snakeOpen.open}
                onClose={handleSnackeClose}
                slots={{ transition: snakeOpen.Transition }}

                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                key={snakeOpen.Transition.name}
                autoHideDuration={2200}
            >
                <Alert
                    onClose={handleSnackeClose}
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