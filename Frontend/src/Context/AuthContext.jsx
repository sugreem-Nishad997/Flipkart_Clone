import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import server from "../environment";
import { jwtDecode } from "jwt-decode";

const client = axios.create({
    baseURL: server
});

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loader, setLoader] = useState(true);
    const register = async (fullName, email, password, otp) => {
        try {
            let response = await client.post("/users/register", {
                name: fullName,
                email: email,
                password: password,
                otp: otp
            });
            console.log(response.data.message);
            return response.data;

        } catch (error) {
            throw error;
        }
    }

    const verifyOtp = async (email, otp) => {
        try {
            let response = await client.post("/users/otpVerify", {
                email: email,
                otp: otp
            });
            return response.data
        } catch (error) {
            throw error
        }
    }

    const login = async (email, password) => {
        try {
            let response = await client.post("/users/login", {
                email: email,
                password: password
            })
            if (response.data.success) {
                const { user, token } = response.data;
                localStorage.setItem("token", token);
                setUser(user);
                return response.data.message;
            }
            return response.data
        } catch (error) {
            throw error
        }
    }

     const logout = () => {
        localStorage.removeItem("token");
        setUser(null)
    }

    const getProfile = async (userId) => {
        try {
           
            let id = userId.id
            let token = localStorage.getItem("token");
            let request = await client.get(`/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return request.data.success ? request.data : request.data.message;
        } catch (error) {
            throw error;
        }
    }

    const updateName = async(id , userForm) => {
        try {
            
            const token = localStorage.getItem("token");
            const response = await client.post(`/users/name/${id}`, userForm, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.success){
                setUser(response.data.updatedProfile);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const updateEmail = async(id , userForm) => {
        try {
            
            const token = localStorage.getItem("token");
            const response = await client.post(`/users/email/${id}`, userForm, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.success){
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            
            if (token) {
                try {
                    const decoded = jwtDecode(token); // decode the JWT
                    const result = await getProfile(decoded);
                    
                    if (result.user) {
                        
                        setUser(result.user);
                    }
                } catch (err) {
                    console.error("Invalid token or fetch failed:", err);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoader(false);
        };

        fetchUserData();
    }, []);
    const data = { register, verifyOtp, login, user, getProfile, logout, updateName, updateEmail }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
