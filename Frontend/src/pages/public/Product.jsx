import { useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Spinner from "../../Loader/Spinner";
import { Alert, Button, Fade, IconButton, Slide, Snackbar } from "@mui/material";
import '../../styles/product.css';

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function Product() {
    const [product, setProduct] = useState(null);
    const { showProduct } = useContext(AuthContext);
    const [loader, setLoader] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [liked, setLiked] = useState(false);
    const [cart, setCart] = useState(false);
    const [showImageIndex, setShowImageIndex] = useState(0);
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const id = useParams();
    const navigate = useNavigate();
    const { addToWishlist, addToCart, user, removeWishlist } = useContext(AuthContext)

    const handleImageClick = (index) => {
        console.log(index)
        setShowImageIndex(index);
    }

    const handleWishlist = async (Transition) => {
        if (liked) {
            try {
                const result = await removeWishlist(product);
                if (result.success) {
                    setLiked(false);
                    setMessage({ ms: result.message, color: 'green', type: 'success' });
                    setSnakeOpen({ open: true, Transition });
                } else {
                    console.log(result);
                    setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                    setSnakeOpen({ open: true, Transition });
                }
            } catch (error) {
                console.log(error);
                setMessage({ ms: error.message, color: 'red', type: 'error' });
                setSnakeOpen({ open: true, Transition });
            }
        } else {
            try {
                const result = await addToWishlist(product);
                if (result.success) {
                    setLiked(true);
                    setMessage({ ms: result.message, color: 'green', type: 'success' });
                    setSnakeOpen({ open: true, Transition });
                } else {
                    console.log(result);
                    setMessage({ ms: result.message, color: 'orange', type: 'warning' });
                    setSnakeOpen({ open: true, Transition });
                }
            } catch (error) {
                console.log(error);
                setMessage({ ms: error.message, color: 'red', type: 'error' });
                setSnakeOpen({ open: true, Transition });
            }
        }
    }

    const handleCart = async (Transition) => {
        try {
            setButtonLoading(true);
            const result = await addToCart(product);
            if (result.success) {
                setMessage({ ms: result.message, color: 'green', type: 'success' });
                setSnakeOpen({ open: true, Transition });
                setTimeout(() => {
                    setButtonLoading(false);
                    navigate("/cart");
                }, 1000);

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

    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoader(true);
                const result = await showProduct(id);
                if (result.success) {
                    setProduct(result.product);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (user && product) {
            const isFound = user.wishlist?.some(item => item === product._id);
            const isInCart = user.cart?.some(item => item === product._id);

            setLiked(isFound || false);
            setCart(isInCart || false);
        }
    }, [user, product]);

    return (
        <div>
            {loader ? <Spinner /> : (
                <div className="productContainer">
                    <div className="left">
                        <div className="insideLeft1">
                            <div className="mainImage" style={{ position: 'relative' }}>
                                <IconButton
                                    onClick={() => handleWishlist(SlideTransition)}
                                    sx={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                        }
                                    }}
                                >
                                    {liked ? <FavoriteIcon sx={{ color: 'red', transition: 'all 0.3s ease' }} /> : <FavoriteBorderIcon />}
                                </IconButton>
                                {product?.images?.length > 0 && <div style={{height:'19rem'}}>
                                    <img src={product.images[showImageIndex]} alt="Product" style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                    }} />
                                </div>}

                            </div>

                            <div className="leftSideImage">
                                {product?.images?.length > 0 && product.images.map((img, idx) => (
                                    <div key={idx} className="imageMappedDiv" style={{ border: idx === showImageIndex ? '2px solid rgb(45, 139, 226)' : '1px solid #e4e6eb', cursor: 'pointer' }}
                                        onMouseEnter={() => handleImageClick(idx)}>
                                        <img src={img} alt="" style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                        }} />
                                    </div>
                                ))}
                            </div>
                            <div className="mainImage1" style={{ position: 'relative' }}>
                                <IconButton
                                    onClick={() => handleWishlist(SlideTransition)}
                                    sx={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                        }
                                    }}
                                >
                                    {liked ? <FavoriteIcon sx={{ color: 'red', transition: 'all 0.3s ease' }} /> : <FavoriteBorderIcon />}
                                </IconButton>
                                {product?.images?.length > 0 && <img src={product.images[showImageIndex]} alt="Product" style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }} />}

                            </div>
                        </div>
                        <div className="buttonDiv">
                            <Button variant="contained" sx={{ backgroundColor: cart ? '#bacad3ff' : '#ff9f00', padding: '0.7rem', width: '9.9rem' }}
                                startIcon={<ShoppingCartIcon />} loading={buttonLoading} loadingPosition="start" onClick={() => { cart ? navigate("/cart") : handleCart(SlideTransition) }}>{cart ? 'Go to Cart' : 'Add to Cart'}</Button>
                            <Button variant="contained" sx={{ backgroundColor: '#fb641b', marginLeft: '1rem', padding: '0.7rem', width: '9.9rem' }} startIcon={<FlashOnIcon />}>buy now</Button>
                        </div>
                    </div>
                    {product && <div style={{ paddingTop: '0.8rem' }}>
                        <div>{product.title}</div>
                        <div className="d-flex my-3">
                            <h3>₹{product.price - (product.price * product.discount / 100)}</h3>
                            <span style={{ textDecoration: ' line-through', color: 'gray', marginInline: '1rem', padding: '0.3rem' }}>₹{product.price}</span>
                            <span className="text-success fw-bold p-1">{product.discount}%off</span>
                        </div>
                        <div style={{ border: '1px solid #e4e6eb', width: '100%' }}>
                            <div style={{ borderBottom: '1px solid #e4e6eb', padding: '0.9rem' }}>
                                <h4>Specification</h4>
                            </div>

                            <div className="p-3">
                                <table className="table table-borderless">
                                    <tbody>
                                        {product.specs.map((feat) => (
                                            <tr>
                                                <td style={{ color: 'gray', fontWeight: '400' }}>{feat.key}</td>
                                                <td>{feat.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>}
                </div>
            )}
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