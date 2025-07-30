import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import server from "../environment";
import { jwtDecode } from "jwt-decode";
import { CardHeader } from "@mui/material";

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
        setUser(null);
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

    const updateName = async (id, userForm) => {
        try {

            const token = localStorage.getItem("token");
            const response = await client.post(`/users/name/${id}`, userForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUser(response.data.updatedProfile);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const updateEmail = async (id, userForm) => {
        try {

            const token = localStorage.getItem("token");
            const response = await client.post(`/users/email/${id}`, userForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const getAddress = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.get(`/users/${id}/address`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const addAddress = async (id, formData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.post(`/users/${id}/address`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const updateAddress = async (id, addressId, formData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.post(`/users/${id}/address/${addressId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error
        }
    }

    const deleteAddress = async (id, addressId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.delete(`/users/${id}/address/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const addProduct = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.post("/admin/addProduct", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error
        }
    }

    const showProduct = async (productId) => {
        try {
            const id = productId.id;
            const response = await client.get(`/${id}`);
            return response.data;
        } catch (error) {
            throw error
        }
    }

    const showAllProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.get("/admin/allProducts", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const updateProduct = async (form) => {
        const existingImages = form.getAll('existingImages[]');
        console.log('existingImages[]:', existingImages);
        try {
            const token = localStorage.getItem("token");
            const response = await client.put("/admin/updateProduct", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const addToCart = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.post("/users/cart", product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const getCartItems = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.get("/users/product/cart", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const removeFromCart = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.put("/users/cart", product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const addToWishlist = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.post("/users/wishlist", product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const getWishlists = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.get("/users/client/wishlist", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const removeWishlist = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const response = await client.put("/users/wishlist", product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success) {
                setUser(response.data.updatedUser);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }


    //public route
    const listAllProducts = async () => {
        try {
            const response = await client.get("/allProducts");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const createOrder = async (a) => {
        try {
            const token = localStorage.getItem("token");
            const res = await client.post("/payment/create-order", { amount: a }, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data?.order;
        } catch (error) {
            console.error("Create order failed:", error);
            return null;
        }
    };

    const verifyPayment = async (order_id, payment_id, signature, amount, orderItems, shippingInfo, totalAmount) => {
        try {
            const token = localStorage.getItem("token");

            const res = await client.post(
                "/payment/verify",
                { order_id, payment_id, signature, amount, orderItems, shippingInfo, totalAmount }, // ✅ Axios sends body like this
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if(res.data.success){
                setUser(res.data.updatedUser);
            }

            return res.data?.success;
        } catch (error) {
            console.error("Verify payment failed:", error?.response?.data || error.message);
            return false;
        }
    };

    const orderCreating = async (product) => {
        try {
            const token = localStorage.getItem('token');
            const response = await client.post("/orders/createOrder", product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUser(updatedUser);
            }
            return response.data
        } catch (error) {
            throw error
        }
    }

    const getAllUserOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await client.get("/orders/getOrders", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data
        } catch (error) {
            throw error
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
    const data = { register, verifyOtp, login, user, getProfile, logout, updateName, updateEmail, getAddress, addAddress, updateAddress, deleteAddress, loader, addProduct, showProduct, showAllProducts, addToCart, addToWishlist, getWishlists, removeWishlist, getCartItems, removeFromCart, updateProduct, listAllProducts, createOrder, verifyPayment, orderCreating, getAllUserOrders }
    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
