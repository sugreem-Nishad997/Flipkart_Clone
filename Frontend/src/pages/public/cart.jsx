import { Button } from "@mui/material";
import '../../styles/cart.css';
import { useNavigate } from "react-router-dom";

export default function cart() {
    let navigate = useNavigate();
    return (
        <div style={{backgroundColor:'rgb(248, 248, 248)',padding:'2rem'}}>
            <div className="cartContainer">
                <div style={{width:'15rem', height:'16rem'}}>
                    <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="" style={{width:'100%'}}/>
                </div>
                <div style={{textAlign:'center'}}>
                    <h5>Missing Cart Items</h5>
                    <p>Login to see the items you added previously</p>
                </div>
                <div>
                    <Button variant="contained" sx={{ backgroundColor: 'rgb(245, 102, 54)'}} size="large" onClick={()=>navigate("/auth")}>Login</Button>
                </div>
            </div>
        </div>
    )
}