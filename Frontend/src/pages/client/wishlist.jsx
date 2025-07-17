import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import Spinner from '../../Loader/Spinner';
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function wishlist() {

    const { getWishlists, removeWishlist } = useContext(AuthContext);
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [hoverIndex, setHoverIndex] = useState(null);
    const navigate = useNavigate();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async (wish) => {
        try {
            const result = await removeWishlist(wish);
            if(result.success){
                console.log(result.message);
            }else{
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }finally{
            setOpen(false);
        }
        
    };
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const result = await getWishlists();
                if (result.success) {
                    setWishlists(result.wishlists);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchWishlist();
        setLoading(false);
    }, [wishlists]);
    if (loading) return <Spinner />
    return (
        <div style={{ backgroundColor: 'rgb(234, 240, 245)', padding: '0.9rem' }} className="personalInfo">
            <div style={{ backgroundColor: 'white' }}>
                <div className="fw-bold p-4" style={{ borderBottom: '1px solid #e3e3e3ff' }}>
                     My Wishlist ({+ wishlists && wishlists.length})
                </div>
                <div style={{ borderBottom: '1px solid #f8f3f8', cursor: 'pointer' }}>
                    {wishlists && wishlists.map((wish, idx) => {
                        return (
                            <div key={idx} className="p-3 d-flex" 
                                onMouseEnter={() => setHoverIndex(idx)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <div style={{ height: '9rem', padding: '1rem' }}>
                                    <img src={wish.images && wish.images[2]} alt="" />
                                </div>
                                <div className="p-3" onClick={() => navigate(`/${wish._id}`)}>
                                    <p style={{ color: idx === hoverIndex && 'rgb(45, 139, 226)' }}>{wish.title}</p>
                                    <span className="fw-bold fs-4">₹{wish.price - (wish.price * wish.discount / 100)}</span>
                                    <span style={{ textDecoration: ' line-through', color: 'gray', marginInline: '1rem', padding: '0.3rem' }}>₹{wish.price}</span>
                                    <span className="text-success fw-bold p-1">{wish.discount}%off</span>
                                </div>
                                <div style={{position:'relative', right:'-8rem', top:'1rem'}}>
                                    <Fragment>
                                        <Button onClick={handleClickOpen} sx={{ color: 'black' }}>
                                            <Delete />
                                        </Button>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                   Are you sure want to remove this product?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose} color="black">Cancel</Button>
                                                <Button onClick={()=>handleClose(wish)} autoFocus color="error">
                                                    yes, remove
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Fragment>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}