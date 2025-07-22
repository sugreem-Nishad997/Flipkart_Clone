import { useState, useContext, useEffect } from 'react';
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
import { Close, FilterFramesSharp, FolderShared, Logout, Menu, PowerSettingsNewSharp, Person } from '@mui/icons-material';


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
    const [open, setOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const { user, logout, getCartItems, getWishlists } = useContext(AuthContext);

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

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const result = await getCartItems();
                if (result.success) {
                    setCart(result.carts);
                } else {
                    console.log(result)
                }
            } catch (error) {
                console.log(error);
            }
        }
        const fetchWishlist = async () => {
            try {
                const result = await getWishlists();
                if (result.success) {
                    setWishlist(result.wishlists);
                } else {
                    console.log(result)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCart();
        fetchWishlist();
    }, [cart, wishlist]);

    return (

        <div className='headerContainer'>

            <div className={`clientSidebar1 ${open ? 'open' : ''}`} style={{ padding: '0rem' }}>
                <div className="close-btn">
                    <Close onClick={() => setOpen(false)} sx={{ fontSize: 24, cursor: 'pointer' }} />
                </div>

                <div className="clientContainer1">
                    <div className='profile' style={{ margin: '0rem' }}>
                        <div style={{ margin: '0.9rem' }}>
                            <Person />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontSize: '0.7rem', marginBottom: '0rem' }}>Hello,</p>
                            <h6>{user ? user.isAdmin ? user.name + '(Admin)' : user.name : 'User'}</h6>
                        </div>
                    </div>
                    <div className='profileManagement'>
                        <div onClick={() => navigate("/account/orders")}>
                            <div className='icon-div order'>
                                <FilterFramesSharp sx={{ color: 'rgb(41, 42, 43)' }} />
                                <h6 className='icon-tag' >My Orders</h6>
                            </div>
                        </div>
                        <div>
                            <div className='icon-div' onClick={() => navigate("/account")}>
                                <Person sx={{ color: 'rgb(41, 42, 43)' }} />
                                <h6 className='icon-tag'>My Account</h6>
                            </div>
                        </div>
                        <div>
                            <div className='icon-div' onClick={() => navigate("/cart")}>
                                <ShoppingCart sx={{ color: 'rgb(41, 42, 43)' }} />
                                <h6 className='icon-tag'>MY Cart</h6>
                            </div>
                        </div>
                        <div className='icon-div' onClick={() => navigate("/account/wishlist")}>
                            <Favorite sx={{ color: 'rgb(41, 42, 43)' }} />
                            <h6 className='icon-tag'>MY Wishlist</h6>
                        </div>
                    </div>
                    {user && <div style={{ position: 'relative', top: '19rem', backgroundColor: 'white' }}>
                        <div className='icon-div'>
                            <PowerSettingsNewSharp sx={{ color: 'rgb(5, 101, 190)' }} />
                            <h6 className='icon-tag' onClick={() => {
                                logout()
                                navigate("/")
                            }}>LOGOUT</h6>
                        </div>
                    </div>}
                </div>

            </div>
            <div className='container'>
                {!open && (
                    <div className="mobile-toggle-btn" style={{ padding: '0rem', top: '0.35rem' }}>
                        <Menu onClick={() => setOpen(true)} sx={{ fontSize: 30, cursor: 'pointer', color: 'black' }} />
                    </div>
                )}
                <div className='logo' onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
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
                        <Button sx={{ color: 'black' }} startIcon={<AccountCircle />} onClick={() => { user ? user.isAdmin ? navigate("/admin") : navigate("/account") : navigate("/auth") }}>{user ? user.isAdmin ? 'Admin' : 'YOU' : 'Login'}</Button>
                    </div>
                    <div className='login' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Button sx={{ color: 'black', width: 'fitContent', ":hover": { backgroundColor: 'rgb(44, 89, 212)', color: 'white' } }} startIcon={<AccountCircle />} onClick={() => { user ? user.isAdmin ? navigate("/admin") : navigate("/account") : navigate("/auth") }} className='elipse'>{user ? user.isAdmin ? 'Mr. ADMIN' : user.name : 'Login'} {dropDown ? <ArrowUp /> : <ArrowDown />}</Button>
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
                            <Button fullWidth sx={{ color: "black", ':hover': { color: 'white', backgroundColor: 'rgb(0, 102, 255)' }, justifyContent: 'flex-start' }} onClick={() => navigate("/account/orders")} startIcon={<Order />}>Orders</Button>
                        </li>
                        <li>
                            <Button fullWidth sx={{ color: "black", ':hover': { color: 'white', backgroundColor: 'rgb(0, 102, 255)' }, justifyContent: 'flex-start' }} onClick={() => navigate("/account/wishlist")} startIcon={<Favorite />}>Wishlist({wishlist && wishlist.length})</Button>
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
                        <CartBadge badgeContent={cart && cart.length} overlap='circular' color='error' />
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