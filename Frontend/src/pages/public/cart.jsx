import { Avatar, Button, Dialog, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
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


export default function cart() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
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
        return () => clearTimeout(timer);
    }, [user])
    if (loading) return <Spinner />
    return (
        <div style={{ backgroundColor: 'rgb(248, 248, 248)', padding: '2rem' }}>
            {!userData ? <div className="cartContainer">
                <div style={{ width: '15rem', height: '16rem' }}>
                    <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="" style={{ width: '100%' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h5>Missing Cart Items</h5>
                    <p>Login to see the items you added previously</p>
                </div>
                <div>
                    <Button variant="contained" sx={{ backgroundColor: 'rgb(245, 102, 54)' }} size="large" onClick={() => navigate("/auth")}>Login</Button>
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
                        </div>
                        <div className='priceDetails'>
                            <p className='fw-bold text-secondary p-3' style={{ borderBottom: '2px solid rgb(235, 236, 236)' }}>PRICE DETAILS</p>
                            <div className='d-flex justify-content-between p-3' style={{ borderBottom: '2px dashed rgb(235, 236, 236)' }} >
                                <span>Price</span>
                                <span>890</span>
                            </div>
                            <div className='d-flex justify-content-between mt-3 fw-bold p-3' style={{ borderBottom: '2px solid rgb(235, 236, 236)' }}>
                                <span>Total Payable</span>
                                <span>890</span>
                            </div>
                            <p className='mt-3 fw-bold text-success p-3'>Your Total Saving on this Order</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}