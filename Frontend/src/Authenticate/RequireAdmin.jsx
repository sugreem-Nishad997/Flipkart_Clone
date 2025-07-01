import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "../Loader/Spinner";

export default function RequireAdmin({children}){
    
    const {user, loader} = useContext(AuthContext);
    if(loader) return <Spinner/>
    return user && user.isAdmin ? children :<Navigate to="/"/>
}