import '../../styles/client.css';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import FilterFramesSharpIcon from '@mui/icons-material/FilterFramesSharp';
import AccountBalanceWalletSharpIcon from '@mui/icons-material/AccountBalanceWalletSharp';
import FolderSharedSharpIcon from '@mui/icons-material/FolderSharedSharp';
import PowerSettingsNewSharpIcon from '@mui/icons-material/PowerSettingsNewSharp';

export default function client(){
    let navigate = useNavigate();
    return(
         <div style={{backgroundColor:'rgb(234, 240, 245)', padding:'0.9rem 0.9rem 0.9rem 2rem', width:'30%'}}>
            <div className="clientContainer">
                <div className='profile'>
                    <div style={{margin:'0.9rem'}}>
                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" alt="" />
                    </div>
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <p style={{fontSize:'0.7rem', marginBottom:'0rem'}}>Hello,</p>
                        <h6>Sugreem Nishad</h6>
                    </div>
                </div>
                <div className='profileManagement'>
                    <div onClick={()=>navigate("/account/orders")}>
                        <div className='icon-div order'>
                            <FilterFramesSharpIcon sx={{color:'rgb(5, 101, 190)'}}/>
                            <h6 className='icon-tag'>MY ORDERS</h6>
                        </div>
                    </div>
                    <div>
                        <div className='icon-div'>
                            <PersonIcon sx={{color:'rgb(5, 101, 190)'}}/>
                            <h6 className='icon-tag'>ACCOUNT SETTINGS</h6>
                        </div>
                        <div className='accountSettings'>
                            <p onClick={()=>navigate("/account")}>Profile Information</p>
                            <p onClick={()=>navigate("/account/addresses")}>Manage Addresses</p>
                        </div>
                    </div>
                    <div>
                        <div className='icon-div'>
                            <AccountBalanceWalletSharpIcon sx={{color:'rgb(5, 101, 190)'}}/>
                            <h6 className='icon-tag'>PAYMENTS</h6>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className='icon-div'>
                            <FolderSharedSharpIcon sx={{color:'rgb(5, 101, 190)'}}/>
                            <h6 className='icon-tag'>MY STUFF</h6>
                        </div>
                        </div>
                        <div className='accountSettings'>
                            <p>All Notifications</p>
                            <p onClick={()=>navigate("/account/wishlist")}>My Wishlists</p>
                        </div>
                    </div>
                    <div>
                         <div className='icon-div'>
                            <PowerSettingsNewSharpIcon sx={{color:'rgb(5, 101, 190)'}}/>
                            <h6 className='icon-tag'>LOGOUT</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}