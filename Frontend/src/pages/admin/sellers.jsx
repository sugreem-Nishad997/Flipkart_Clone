import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import '../../styles/admin.css';
export default function sellers(){
    return(
         <div  className="rightPannel">
            <div>
                <div>
                    <div style={{display:'flex',justifyContent:'end'}}>
                        <Button variant="outlined" startIcon={<LogoutIcon />}>
                            Log Out
                        </Button>
                    </div>
                    <div>
                        Sellers
                    </div>
                </div>
            </div>
        </div>
    )
}