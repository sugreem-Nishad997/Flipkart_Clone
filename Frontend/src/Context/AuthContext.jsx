import { createContext, useState } from "react";
import axios from 'axios';
import server from "../environment";

const client = axios.create({
    baseURL: server
});

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
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

            console.log(response.data);
            return response.data
        } catch (error) {
            throw error
        }
    }

    const login = async (email, password) => {
        try {
            let response = await client.post("/users/login", {
                email:email,
                password:password
            })
            if(response.data.success){
                const {user, token} = response.data;
                localStorage.setItem("token", token);
                setUser(user);
                return response.data.message;
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    const data = { register, verifyOtp, login, user }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
