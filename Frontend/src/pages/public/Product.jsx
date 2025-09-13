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
                setMessage({ ms: error.response.data.message, color: 'red', type: 'error' });
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
                setMessage({ ms: error.response.data.message, color: 'red', type: 'error' });
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
            setMessage({ ms: error.response.data.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }

    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };

    const handleBuy = async () => {
        try {
            if (product) {
                const isInCart = user.cart?.some(item => item === product._id);
                if (!isInCart) {
                    const result = await addToCart(product);
                    if (result.success) {
                        navigate('/checkout');
                    } else {
                        console.log(result)
                    }
                }else{
                    navigate('/checkout');
                }

            }
        } catch (error) {
            setMessage({ ms: error.response.data.message, color: 'red', type: 'error' });
            setSnakeOpen({ open: true, Transition });
        }
    }
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
                                {product?.images?.length > 0 && <div style={{ height: '19rem' }}>

                                    <img src={product.images[showImageIndex].url} alt="Product" style={{
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
                                        <img src={img.url} alt="" style={{
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
                                {product?.images?.length > 0 && <img src={product.images[showImageIndex].url} alt="Product" style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }} />}

                            </div>
                        </div>
                        <div className="buttonDiv">
                            <Button variant="contained" sx={{ backgroundColor: cart ? '#bacad3ff' : '#ff9f00', padding: '0.7rem', width: '9.5rem' }}
                                startIcon={<ShoppingCartIcon />} loading={buttonLoading} loadingPosition="start" onClick={() => { user ? (cart ? navigate("/cart") : handleCart(SlideTransition)) : navigate('/auth') }}>{cart ? 'Go to Cart' : 'Add to Cart'}</Button>
                            <Button variant="contained" sx={{ backgroundColor: '#fb641b', marginLeft: '1rem', padding: '0.7rem', width: '9.5rem' }} startIcon={<FlashOnIcon />}
                                onClick={() => (user ? handleBuy() : navigate("/auth"))}
                            >buy now</Button>
                        </div>
                    </div>
                    {product && <div style={{ paddingTop: '0.8rem', height: '100%', width: '100%' }}>
                        <div>{product.title}</div>
                        <div className="d-flex my-3">
                            <h3>₹{product.discount ? Math.round(product.price - (product.price * product.discount) / 100) : product.price}</h3>
                            <span style={{ textDecoration: ' line-through', color: 'gray', marginInline: '1rem', padding: '0.3rem' }}>₹{product.price}</span>
                            {product.discount && <span className="text-success fw-bold p-1">{product.discount}%off</span>}
                        </div>
                        {product.category === 'clothing' && <div style={{ height: '3rem' }}>
                            <span className="me-4">Size</span>
                            {product.size.map((s, idx) => {
                                return (
                                    <span key={idx} style={{
                                        border: '1px solid #dcdddfff', marginLeft:
                                            '1rem', padding: '0.5rem', width: "1.1rem", height: '0.7rem', fontWeight: 'bold'
                                    }}>{s}</span>
                                )
                            })}
                        </div>}
                        <div style={{ border: '1px solid #e4e6eb', width: '95%' }}>
                            <div style={{ borderBottom: '1px solid #e4e6eb', padding: '0.9rem' }}>
                                <h4>{product.category === 'clothing' ? 'Product Details' : 'Specification'}</h4>
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
                        <div style={{ border: '1px solid #e4e6eb', width: '95%', marginTop: '1rem', padding: '1rem', marginBottom: "2rem" }}>
                            <div className="d-flex justify-content-between" style={{ borderBottom: '1px solid #e4e6eb' }}>
                                <h4>Rating & Reviews</h4>
                                <Button color="black" sx={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .26)', padding: '1rem' }}>Rate Product</Button>
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
