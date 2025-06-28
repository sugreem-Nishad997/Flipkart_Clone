import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCart from '@mui/icons-material/ShoppingCartOutlined';
import ArrowDown from '@mui/icons-material/KeyboardArrowDownSharp';
import ArrowUp from '@mui/icons-material/KeyboardArrowUpSharp';
import Favorite from '@mui/icons-material/FavoriteBorderOutlined';
import Order from '@mui/icons-material/CardGiftcardSharp';
import { styled } from '@mui/material/styles';
import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import "../../styles/header.css";
import { Button } from '@mui/material';
import { AuthContext } from '../../Context/AuthContext';
import { Logout } from '@mui/icons-material';


const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -15px;
    right: 0px;
  }
`;
export default function header() {

    const [dropDown, setDropDown] = useState(false);
    const [input, setInput] = useState('');
    const [focus, setFocus] = useState(false);
    const { user, logout } = useContext(AuthContext);

    const handleform = (event) => {
        event.preventDefault();
    }

    const handleMouseEnter = () => {
        setDropDown(true);
    }

    const handleMouseLeave = () => {
        setDropDown(false);
    }

    let navigate = useNavigate();

    return (

        <div className='headerContainer'>
            <div class="offcanvas offcanvas-start bg-light text-black" tabindex="-1" id="offcanvasMenu" style={{ width: '60%' }}>
                <div class="offcanvas-header" style={{ backgroundColor: 'rgb(35,111, 211)', color: 'white' }}>
                    <AccountCircle sx={{ marginRight: '0.5rem' }} />
                    <h5 class="offcanvas-title" onClick={() => {user?navigate("/account"):navigate("/auth")}} >{user?user.name:'Login & Signup'}</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link text-black" onClick={()=>navigate("/account/orders")}>My Orders</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-black" onClick={() => navigate("/cart")}>My Cart</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-black" onClick={()=>navigate("/account/wishlist")}>My Wishlist</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-black" onClick={()=>navigate("/account")}>My Account</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='container'>
                <nav class="navbar navbar-light bg-light" style={{ position: 'relative', top: '-0.8rem' }}>
                    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu" style={{ border: 'none', backgroundColor: 'white' }}>
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </nav>
                <div className='logo' onClick={()=>navigate("/")}>
                    <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/fkheaderlogo_exploreplus-44005d.svg" alt="" />
                </div>
                <div className='responsiveSearchA'>
                    <form noValidate autoComplete="off" onSubmit={handleform}>
                        <div className='search'>
                            <IconButton type='button' sx={{ backgroundColor: 'rgb(225, 234, 238)', borderRadius: '0.4rem 0 0 0.4rem', ':hover': { backgroundColor: 'rgb(225, 234, 238)' } }} >
                                <SearchIcon />
                            </IconButton>
                            <input type="text" placeholder='Search for Products, Brands and More' className='search-input' value={input} onChange={(e) => setInput(e.target.value)} onClick={() => setFocus(!focus)} />
                        </div>
                    </form>
                    <ul className='search-dropDown' style={{ display: focus ? '' : 'none' }}>
                        <li>Trending</li>
                        <li>
                            <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>mobiles</Button>
                        </li>
                        <li>
                            <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>shoes</Button>
                        </li>
                        <li>
                            <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>laptops</Button>
                        </li>
                        <li>
                            <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>watches</Button>
                        </li>
                        <li>
                            <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>t-shirts</Button>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="mobileLogin">
                        <Button sx={{ color: 'black' }} startIcon={<AccountCircle />} onClick={() => navigate("/auth")}>{user?'YOU':'Login'}</Button>
                    </div>
                    <div className='login' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Button sx={{ color: 'black', ":hover": { backgroundColor: 'rgb(44, 89, 212)', color: 'white' } }} startIcon={<AccountCircle />} onClick={() => { user ? navigate("/account") : navigate("/auth") }}>{user ? user.name : 'Login'} {dropDown ? <ArrowUp /> : <ArrowDown />}</Button>
                    </div>
                    <ul className="dropDownList" style={{ display: dropDown === false ? 'none' : '', padding: '0.6rem' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <li className='list-1' style={{ display: user ? 'none' : '' }}>
                            <span>New Customer?</span>
                            <span onClick={() => navigate("/auth")} className='signup'>SignUp</span>
                        </li>
                        <li>
                            <Button fullWidth sx={{ color: "black", ':hover': { color: 'white', backgroundColor: 'rgb(0, 102, 255)' }, justifyContent: 'flex-start' }} startIcon={<AccountCircle />} onClick={() => navigate("/account")}>My Profile</Button>
                        </li>
                        <li>
                            <Button fullWidth sx={{ color: "black", ':hover': { color: 'white', backgroundColor: 'rgb(0, 102, 255)' }, justifyContent: 'flex-start' }} startIcon={<Order />}>Orders</Button>
                        </li>
                        <li>
                            <Button fullWidth sx={{ color: "black", ':hover': { color: 'white', backgroundColor: 'rgb(0, 102, 255)' }, justifyContent: 'flex-start' }} startIcon={<Favorite />}>Wishlist</Button>
                        </li>
                        <li style={{ display: user ? '' : 'none' }}>
                            <Button fullWidth sx={{ color: "black", ':hover': { color: 'white', backgroundColor: 'rgb(0, 102, 255)' }, justifyContent: 'flex-start' }} startIcon={<Logout />} onClick={() => {
                                logout()
                                navigate("/")
                            }}>Logout</Button>
                        </li>
                    </ul>
                </div>
                <div>
                    <Button sx={{ color: 'black' }} startIcon={<ShoppingCart />} onClick={() => navigate("/cart")}>
                        <CartBadge badgeContent={2} overlap='circular' />
                        Cart
                    </Button>
                </div>
            </div>
            <div className='responsiveSearchB'>
                <form noValidate autoComplete="off" onSubmit={handleform}>
                    <div className='search'>
                        <IconButton type='button' sx={{ backgroundColor: 'rgb(225, 234, 238)', borderRadius: '0.4rem 0 0 0.4rem', ':hover': { backgroundColor: 'rgb(225, 234, 238)' } }}>
                            <SearchIcon />
                        </IconButton>
                        <input type="text" placeholder='Search for Products, Brands and More' className='search-input' value={input} onChange={(e) => setInput(e.target.value)} onClick={() => setFocus(!focus)} />
                    </div>
                </form>
                <ul className='search-dropDown' style={{ display: focus ? '' : 'none' }}>
                    <li>Trending</li>
                    <li>
                        <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>mobiles</Button>
                    </li>
                    <li>
                        <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>shoes</Button>
                    </li>
                    <li>
                        <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>laptops</Button>
                    </li>
                    <li>
                        <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>watches</Button>
                    </li>
                    <li>
                        <Button sx={{ color: 'black' }} startIcon={<SearchIcon />}>t-shirts</Button>
                    </li>
                </ul>
            </div>
        </div>
    )
}