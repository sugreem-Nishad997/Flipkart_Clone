import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../Context/AuthContext"
import Spinner from "../../Loader/Spinner";

export default function order() {

    const { getAllUserOrders } = useContext(AuthContext);
    const [orders, setOrders] = useState(null);
    const [products, setProducts] = useState(null);
    const [loader, setLoader] = useState(true);
    useEffect(() => {
        const initialize = async () => {
            try {
                const result = await getAllUserOrders();
                if (result.success) {
                    console.log(result.orders)
                    setOrders(result.orders);
                } else {
                    console.log(result);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoader(false);
            }
        }
        initialize();
    }, [])
    if (loader) return <Spinner />
    return (
        <div style={{ backgroundColor: 'rgb(234, 240, 245)' }} className="personalInfo">
            <div className="mb-2">My Orders</div>
            <div>
                {orders.length === 0 ? (
                    <p>No orders yet.</p>
                ) : (orders.flatMap(order => 
                    order.orderItems.map((item, idx) => {
                        return (
                        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.3rem', border: '1px solid #b3b3b3ff' }} key={idx}>{item._id}</div>
                    )
                    })
                    
                ))}
            </div>
        </div>
    )
}