import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../styles/admin.css';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../Loader/Spinner';

export default function products() {
    const { showAllProducts } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setLoader(true);
        const fetchAllProducts = async () => {
            try {
                const result = await showAllProducts();
                if (result.success) {
                    setProducts(result.products);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        }
        fetchAllProducts();
    }, [])
    { loader && <Spinner /> }
    return (
        <div className="rightPannel" style={{ backgroundColor: "#eaf2f7ff" }}>
            <div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h5>All Products</h5>
                        <Button variant="outlined" startIcon={<LogoutIcon />} sx={{ marginBottom: '0.5rem' }}>
                            Log Out
                        </Button>
                    </div>

                    <div style={{ backgroundColor: 'white' }}>
                        {products.map((p, idx) => (
                            <div key={p._id} style={{ borderBottom: '1px solid #e3e3e3ff', cursor:'pointer'}}
                                className='p-2 d-flex'
                                onMouseEnter={() => setHoverIndex(idx)}
                                onMouseLeave={() => setHoverIndex(null)}>
                                <div style={{ height: '10rem', padding: '1rem' }}>
                                    <img src={p.images && p.images[3].url} alt="" style={{ objectFit: 'contain', width: '100%' }} />
                                </div>
                                <div className="p-3" onClick={() => navigate(`/${p._id}`)}>
                                    <p style={{ color: idx === hoverIndex && 'rgb(45, 139, 226)' }} className="mobilePara">{p.title}</p>
                                    <span className="fw-bold fs-4">₹{Math.round(p.price - (p.price * p.discount) / 100)}</span>
                                    <span style={{ textDecoration: ' line-through', color: 'gray', marginInline: '1rem', padding: '0.3rem' }}>₹{p.price}</span>
                                    <span className="text-success fw-bold p-1">{p.discount}%off</span>
                                </div>
                                <div onClick={() => navigate(`/admin/addProduct/${p._id}`)} className='mt-3'>update</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}