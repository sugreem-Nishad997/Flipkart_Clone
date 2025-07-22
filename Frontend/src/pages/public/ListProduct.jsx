import { useNavigate, useParams } from "react-router-dom"
import '../../styles/ListProduct.css';
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { IconButton, Alert, Button, Fade, Slide, Snackbar } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Spinner from "../../Loader/Spinner";

function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
}

export default function ListProduct() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const { listAllProducts, addToWishlist, removeWishlist, user } = useContext(AuthContext);
    const [hoveredIndex, setHoveredIndex] = useState(0);
    const [hoveredProd, setHoveredProd] = useState(null);
    const [message, setMessage] = useState({ ms: '', type: '', color: '' });
    const [snakeOpen, setSnakeOpen] = useState({ open: false, Transition: Fade });
    const [liked, setLiked] = useState(false);
    const [hovering, setHovering] = useState(false);
    const [loader, setLoader] = useState(true);
    const intervalRef = useRef(null);

    const handleMouseEnter = (prod) => {
        if (intervalRef.current) return;
        setHoveredProd(prod._id);
        let current = 0;
        intervalRef.current = setInterval(() => {
            current++;
            if (current >= prod.images.length) {
                if (hovering) {
                    console.log("yes")
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return;
                }
                current = 0;
            }
            setHoveredIndex(current);
        }, 1000);
    };
    const handleMouseLeave = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setHoveredIndex(0);
        setHoveredProd(null);
    };

    const handleWishlist = async (Transition, product, idx) => {
        try {
            let result;
            if (liked[idx]) {
                result = await removeWishlist(product);
            } else {
                result = await addToWishlist(product);
            }

            if (result.success) {
                setLiked((prev) =>
                    prev.map((val, i) => (i === idx ? !val : val))
                );

                setMessage({ ms: result.message, color: 'green', type: 'success' });
            } else {
                console.log(result);
                setMessage({ ms: result.message, color: 'orange', type: 'warning' });
            }
        } catch (error) {
            console.log(error);
            setMessage({
                ms: error?.response?.data?.message || error.message,
                color: 'red',
                type: 'error',
            });
        } finally {
            setSnakeOpen({ open: true, Transition });
        }
    };


    const handleClose = () => {
        setSnakeOpen(prev => ({ ...prev, open: false }));
    };
    useEffect(() => {
        const fetchproduct = async () => {
            try {
                const result = await listAllProducts();
                if (result.success) {
                    const headsets = result.products.filter((prod) => prod.search === name);
                    setProducts(headsets);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }finally{
                setLoader(false);
            }
        }
        fetchproduct();
    }, []);

    useEffect(() => {
        setLoader(true);
        if (user && Array.isArray(products)) {
            const likedStatuses = products.map(product =>
                user.wishlist?.includes(product._id) || false
            );
            setLiked(likedStatuses);
        }
        setLoader(false)
    }, [user, products])

    if(loader) return <Spinner/>
    return (
        <div style={{ backgroundColor: 'rgb(242, 249, 252)'}} className="ListProductContainer">
            <div style={{ backgroundColor: 'white' }}>
                <div className="p-2">
                    <span onClick={() => navigate('/')} className="navigation">Home{' > '}</span>
                    <span onClick={() => navigate(`/showList/${name}`)} className="navigation">{name}</span>
                </div>
                <div>
                    <h5 className="p-3">{name}</h5>
                </div>
                <div style={{ borderTop: '1px solid #e4e6eb' }} >
                    <div className="Customrow row row-cols-2 row-cols-md-4 row-clos-sm-2 row-cols-xl-4 row-cols-sm-2">
                        {products.length > 0 && products.map((prod, idx) => {
                            return (
                                <div key={idx} className="Customcol col">
                                    <div style={{ boxShadow: hoveredProd && hoveredProd === prod._id ? '0 2px 8px 0 rgba(144, 142, 142, 0.25)' : '', padding: '1rem', cursor: 'pointer', borderRadius: '2px'}}
                                        onMouseEnter={() => handleMouseEnter(prod)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className="d-flex">
                                            {hoveredProd && hoveredProd === prod._id ?
                                                <div className="d-flex mb-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`progress-point ${i <= hoveredIndex ? 'filled' : ''}`}
                                                            style={{ marginLeft: '0.2rem' }}
                                                        />
                                                    ))}
                                                </div> : <div className="mb-4"></div>
                                            }
                                            <div style={{ marginLeft: 'auto', marginBottom: '0.5rem' }}>
                                                <IconButton
                                                    onClick={() => handleWishlist(SlideTransition, prod, idx)}
                                                    sx={{
                                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                                        }
                                                    }}
                                                >
                                                    {liked[idx] ? <FavoriteIcon sx={{ color: 'red', transition: 'all 0.3s ease' }} /> : <FavoriteBorderIcon />}
                                                </IconButton>
                                            </div>
                                        </div>
                                        <div style={{ height: "12rem", width: '11rem' }}>
                                            <img src={prod.images[hoveredProd && hoveredProd === prod._id ? hoveredIndex : 0].url} alt="Product images"  className="prodImage"/>
                                        </div>
                                        <div className="elipse2" style={{ color: hoveredProd && hoveredProd === prod._id && '#2a91db' }} onClick={()=>navigate(`/${prod._id}`)}>{prod.title}</div>
                                        <div className="d-flex my-3">
                                            <h5>₹{prod.discount ? Math.floor(prod.price - (prod.price * prod.discount) / 100) : prod.price}</h5>
                                            <span style={{ textDecoration: ' line-through', color: 'gray', marginInline: '0.7rem', fontSize:'0.78rem'}}>₹{prod.price}</span>
                                            {prod.discount && <span className="text-success">{prod.discount}%off</span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
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
        </div>
    )
}