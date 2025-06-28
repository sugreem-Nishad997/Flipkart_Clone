import '../../styles/admin.css';
import { Link } from 'react-router-dom';
export default function admin() {
    return (
        <div className="leftPannel">
            <div>
                <div>
                    <div style={{ backgroundColor: 'rgb(30, 119, 235)' }}>
                        <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/flipkart-logo-login-5e2d0b.svg" alt="" style={{ display: 'flex', justifySelf: 'center' }} />
                    </div>
                    <div className='managements'>
                        <div><Link to={'/admin'}style={{textDecoration:'none', color:'black'}}>Customers</Link></div>
                        <div><Link to={'/admin/sellers'}style={{color:'black', textDecoration:'none'}}>Sellers</Link></div>
                        <div><Link to={'/admin/products'}style={{color:'black', textDecoration:'none'}}>Products</Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}