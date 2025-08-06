import httpStatus from 'http-status';
import User from '../models/user_models.js';
import { sendEmail } from '../utils/sendEmail.js';

const getUserProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) return res.json({ message: "User not found", success: false });

        res.status(httpStatus.OK).json({ message: "User founded", user, success: true })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updatePersonalInfo = async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body;

        if (!update) return res.json({ message: "All fields required", success: false });

        if (id !== req.user.id) {
            return res.json({ message: "not acceptable", success: false });
        }

        const updatedProfile = await User.findByIdAndUpdate(id, update, { new: true });

        res.status(httpStatus.CREATED).json({ message: "Profile Updated", updatedProfile, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const updateEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const { email } = req.body;

        if (!email) return res.json({ message: "Email Field required", success: false });

        if (id !== req.user.id) return res.json({ message: "Not Acceptable", success: false });

        const user = await User.findById(id);
        if (!user || !user.isVerified) return res.json({ message: "User not verified", success: false });

        if (email === user.email) return res.json({ message: "Email is already verified", success: false });

        const existingEmailUser = await User.findOne({ email });
        if (existingEmailUser && existingEmailUser._id.toString() !== id) {
            return res.json({ message: "Email already in use", success: false });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const updatedUser = await User.findByIdAndUpdate(id, { email, otp, otpExpiry, isVerified: false }, { new: true });
        await sendEmail(email, "Your OTP code", `Your OTP is ${otp}`);
        res.status(httpStatus.CREATED).json({ message: "Email verificatoin code sended", updatedUser, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const addAddress = async (req, res) => {
    try {
        const id = req.params.id;
        const address = req.body;
        if (id !== req.user.id) return res.json({ message: "Not Acceptable", success: false });

        const user = await User.findById(id);
        if (!user || !user.isVerified) return res.json({ message: "User not verified", success: false });

        const requiredFields = ['fullname', 'mobile', 'addressType', 'city', 'state', 'pincode', 'locality', 'area'];
        for (let field of requiredFields) {
            if (!address[field]) {
                return res.json({ message: `Missing field: ${field}`, success: false })
            }
        }
        const updatedUser = await User.findByIdAndUpdate(id, { $push: { addresses: address } }, { new: true });
        if (!updatedUser) return res.json({ message: "address not added", success: false });

        const lastAdded = updatedUser.addresses[updatedUser.addresses.length - 1];
        res.status(httpStatus.CREATED).json({ message: "Address is added successfully", success: true, updatedUser, lastAdded });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getAllAddress = async (req, res) => {
    try {
        const id = req.params.id;

        if (id !== req.user.id) return res.json({ message: "Not Acceptable", success: false });

        const user = await User.findById(id);
        if (!user || !user.isVerified) return res.json({ message: "User not verified", success: false });

        const result = await User.findById(id).select('addresses');
        const addresses = result.addresses;
        if (!addresses) return res.json({ message: "No addresses Added yet", success: false });

        res.status(httpStatus.CREATED).json({ message: "Address founded", success: true, addresses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const updateAddress = async (req, res) => {
    try {
        const { id, addressId } = req.params;
        const address = req.body;
        if (id !== req.user.id) return res.json({ message: "Not Acceptable", success: false });

        const user = await User.findById(id);
        if (!user || !user.isVerified) return res.json({ message: "User not verified", success: false });

        const isAddressExist = user.addresses.id(addressId);
        if (!isAddressExist) return res.json({ message: "Address  is not exist", success: false });

        const requiredFields = ['fullname', 'mobile', 'addressType', 'city', 'state', 'pincode', 'locality', 'area'];
        for (let field of requiredFields) {
            if (!address[field]) {
                return res.json({ message: `Missing field: ${field}`, success: false })
            }
        }

        Object.assign(isAddressExist, address);

        const updatedUser = await user.save();
        
        if (!updatedUser) return res.json({ message: "address not updated", success: false });

        res.status(httpStatus.CREATED).json({ message: "Address is updated", success: true, updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const deleteAddress = async(req, res) => {
    try {
        const {id, addressId} = req.params;

        if(id !== req.user.id) return res.json({message:"Not Acceptable", success: false});

        const user = await User.findById(id);
        if(!user || !user.isVerified) return res.json({message:"User not verified"});

        const isAddressExist = user.addresses.id(addressId);
        if(!isAddressExist) return res.json({message:"Address not exist", success:false});

        user.addresses = user.addresses.filter((addr) => addr._id.toString() !== addressId);
        const updatedUser = await user.save();

        if(!updatedUser) return res.json({message:"Address not deleted", success: false});

        return res.status(httpStatus.OK).json({message:"Address deleted", success:true, updatedUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
}

const addToWishlist = async(req, res) => {
    try {
        const product = req.body;
        if(!product) return res.json({message:"Product required to add in wishlist", success:false});

        const id = req.user.id;
        const user = await User.findById(id);
        if(!user || !user.isVerified) return res.json({message:"User not exist", success:false});

        const updatedUser = await User.findByIdAndUpdate(id, {$push: {wishlist: product}}, {new: true});

        if(!updatedUser) return res.json({message:'Product not added in wishlist', success:false});

        const lastAdded = updatedUser.wishlist[updatedUser.wishlist.length - 1];
        res.status(httpStatus.CREATED).json({message:"Product added in wishlist", success:true, lastAdded, updatedUser});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message, success:false});
    }
}

const getWishlists = async(req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if(!user || !user.isVerified) return res.json({message:"User not exist", success:false});

        const user1 = await User.findById(id).populate('wishlist');
        if(!user1.wishlist) return res.json({message:'wishlist is empty', success:false});
        const wishlists = user1.wishlist;
        res.status(httpStatus.CREATED).json({success:true, wishlists});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message, success:false});
    }
}

const removeWishlist = async(req, res) => {
    try {
        const product = req.body;
        const id = req.user.id;
        if(!id || !product._id) return res.json({message:"user or productId required", success:false});

        const user = await User.findById(id);
        if(!user || !user.isVerified) return res.json({messsage:"User not found or verified", success:true});
        
        const arrayOfObjectIds = user.wishlist.map((wish) => wish._id);
        
        const isProductExist = arrayOfObjectIds.some(id => id.toString() === product._id);
        if(!isProductExist) return res.json({message:"Product not found", success:false});

        user.wishlist = user.wishlist.filter((wish) => wish._id.toString() !== product._id);

        const updatedUser = await user.save();
        res.status(httpStatus.OK).json({message:"Wishlist Removed", success:true, updatedUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message, success:false});
    }
}

const addToCart = async(req, res) => {
    try {
        const product = req.body;
        if(!product) return res.json({message:"Product required to add in cart", success:false});

        const id = req.user.id;
        const user = await User.findById(id);
        if(!user || !user.isVerified) return res.json({message:"User not exist", success:false});

        const updatedUser = await User.findByIdAndUpdate(id, {$push: {cart: product}}, {new: true});

        if(!updatedUser) return res.json({message:'Product not added in cart', success:false});

        res.status(httpStatus.CREATED).json({message:"Product added in cart", success:true, updatedUser});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message, success:false});
    }
}

const getCartItems = async(req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if(!user || !user.isVerified) return res.json({message:"User not exist", success:false});

        const user1 = await User.findById(id).populate("cart");
        if(!user1.cart) return res.json({message:'Cart is empty', success:false});
        const carts = user1.cart;
        res.status(httpStatus.CREATED).json({success:true, carts});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message, success:false});
    }
}

const removeFromCart = async(req, res) => {
    try {
        const product = req.body;
        const id = req.user.id;
        if(!id || !product._id) return res.json({message:"user or productId required", success:false});

        const user = await User.findById(id);
        if(!user || !user.isVerified) return res.json({messsage:"User not found or verified", success:true});
        
        const arrayOfObjectIds = user.cart.map((c) => c._id);
        
        const isProductExist = arrayOfObjectIds.some(id => id.toString() === product._id);
        if(!isProductExist) return res.json({message:"Product not found", success:false});

        user.cart = user.cart.filter((c) => c._id.toString() !== product._id);

        const updatedUser = await user.save();
        res.status(httpStatus.OK).json({message:"Product removed from Cart", success:true, updatedUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message, success:false});
    }
}


export {getUserProfile, updatePersonalInfo, updateEmail, addAddress, getAllAddress, updateAddress, deleteAddress, addToWishlist, addToCart, getWishlists, removeWishlist, getCartItems, removeFromCart };