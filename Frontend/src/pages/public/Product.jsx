import { useContext } from "react"
import { AuthContext } from "../../Context/AuthContext"
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Spinner from "../../Loader/Spinner";
import { Button } from "@mui/material";

export default function Product() {
    const [product, setProduct] = useState(null);
    const { showProduct } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    const id = useParams();

    useEffect(() => {
        setLoader(true);
        const fetchProduct = async () => {
            try {
                const result = await showProduct(id);
                if (result.success) {
                    setProduct(result.product);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoader(false);
            }
        }
        fetchProduct();
    }, [id]);


    return (
        <div>
            {loader ? <Spinner /> : (
                <div className="d-flex" style={{ columnGap: '1.6rem', paddingLeft: '1rem' }}>
                    <div style={{ width: '35%', position: 'sticky', bottom: '0', top: '4.5rem', alignSelf: 'flex-start' }}>
                        <div className="d-flex" style={{ height: '25rem' }}>
                            <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                {product?.images?.length > 0 && product.images.map((img, idx) => (
                                    <div key={idx}
                                        style={{
                                            position: 'relative',
                                            flex: '0 0 auto',
                                            width: '5rem',
                                            height: '7rem',
                                            maxWidth: '7rem',
                                            minWidth: '7rem',
                                            borderRadius: '2px',
                                            border: '1px solid #e4e6eb',
                                            padding: '0.3rem',
                                            overflow: 'hidden'
                                        }}>
                                        <img src={img} alt="" style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ border: "1px solid #e4e6eb", borderRadius: '2px', padding: '0.98rem' }}>
                                {product?.images?.length > 0 && <img src={product.images[2]} alt="Product" />}

                            </div>
                        </div>
                        <div style={{ padding: "1rem", marginLeft: '6.3rem', width: '100%' }}>
                            <Button variant="contained" sx={{ backgroundColor: '#ff9f00', padding: '0.7rem', width: '9.9rem' }}>Add to cart</Button>
                            <Button variant="contained" sx={{ backgroundColor: '#fb641b', marginLeft: '1rem', padding: '0.7rem', width: '9.9rem' }}>buy now</Button>
                        </div>
                    </div>
                    {product && <div style={{ paddingTop: '0.6rem' }}>
                        <div>{product.title}</div>
                        <div className="d-flex">
                            <h3>₹{product.price - (product.price * product.discount / 100)}</h3>
                            <span style={{textDecoration:' line-through', color:'gray', marginInline:'1rem', padding:'0.5rem'}}>{product.price}</span>
                            <span className="text-success fw-bold p-2">{product.discount}%off</span>
                        </div>
                    </div>}
                </div>
            )}
        </div>
    )
}