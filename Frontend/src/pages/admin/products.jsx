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
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setLoader(true);
        const fetchAllProducts = async () =>{
            try {
                const result = await showAllProducts();
                if (result.success) {
                    setProducts(result.products);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            }finally{
                setLoader(false);
            }
        }
        fetchAllProducts();
    }, [])
    {loader && <Spinner/>}
    return (
        <div className="rightPannel">
            <div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button variant="outlined" startIcon={<LogoutIcon />}>
                            Log Out
                        </Button>
                    </div>
                    <div className='p-2'>
                        {products.map(p => (
                           <div key={p._id} onClick={()=>navigate(`/${p._id}`)}>
                            {p.title}
                            <div onClick={()=>navigate(`/admin/addProduct/${p._id}`)} className='mt-3'>update</div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}