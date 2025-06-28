import '../../styles/client.css';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import FilterFramesSharpIcon from '@mui/icons-material/FilterFramesSharp';
import AccountBalanceWalletSharpIcon from '@mui/icons-material/AccountBalanceWalletSharp';
import FolderSharedSharpIcon from '@mui/icons-material/FolderSharedSharp';
import PowerSettingsNewSharpIcon from '@mui/icons-material/PowerSettingsNewSharp';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';

export default function client() {

    const [open, setOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();


    return (
        <>
            {!open && (
                <div className="mobile-toggle-btn">
                    <MenuIcon onClick={() => setOpen(true)} sx={{ fontSize: 30, cursor: 'pointer' }} />
                </div>
            )}
            <div className={`clientSidebar ${open ? 'open' : ''}`}>
                <div className="close-btn">
                    <CloseIcon onClick={() => setOpen(false)} sx={{ fontSize: 24, cursor: 'pointer' }} />
                </div>

                <div className="clientContainer">
                    <div className='profile'>
                        <div style={{ margin: '0.9rem' }}>
                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontSize: '0.7rem', marginBottom: '0rem' }}>Hello,</p>
                            <h6>{user ? user.name : 'User'}</h6>
                        </div>
                    </div>
                    <div className='profileManagement'>
                        <div onClick={() => navigate("/account/orders")}>
                            <div className='icon-div order'>
                                <FilterFramesSharpIcon sx={{ color: 'rgb(5, 101, 190)' }} />
                                <h6 className='icon-tag'>MY ORDERS</h6>
                            </div>
                        </div>
                        <div>
                            <div className='icon-div'>
                                <PersonIcon sx={{ color: 'rgb(5, 101, 190)' }} />
                                <h6 className='icon-tag'>ACCOUNT SETTINGS</h6>
                            </div>
                            <div className='accountSettings'>
                                <p onClick={() => navigate("/account")}>Profile Information</p>
                                <p onClick={() => navigate("/account/addresses")}>Manage Addresses</p>
                            </div>
                        </div>
                        <div>
                            <div className='icon-div'>
                                <AccountBalanceWalletSharpIcon sx={{ color: 'rgb(5, 101, 190)' }} />
                                <h6 className='icon-tag'>PAYMENTS</h6>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div className='icon-div'>
                                    <FolderSharedSharpIcon sx={{ color: 'rgb(5, 101, 190)' }} />
                                    <h6 className='icon-tag'>MY STUFF</h6>
                                </div>
                            </div>
                            <div className='accountSettings'>
                                <p>All Notifications</p>
                                <p onClick={() => navigate("/account/wishlist")}>My Wishlists</p>
                            </div>
                        </div>
                        <div>
                            <div className='icon-div'>
                                <PowerSettingsNewSharpIcon sx={{ color: 'rgb(5, 101, 190)' }} />
                                <h6 className='icon-tag' onClick={() => {
                                    logout()
                                    navigate("/")
                                }}>LOGOUT</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}