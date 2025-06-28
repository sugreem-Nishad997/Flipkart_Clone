import httpStatus from 'http-status'
import User from '../models/user_models.js';
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import { createSecretToken } from '../utils/secretToken.js';
const register = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.json({message:"Email or name must required", success: false});
        }
        const userExist = await User.findOne({email});
        if(userExist){
            return res.json({message:"User already exist", success:false});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = Math.floor(1000 + Math.random()*9000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

        const user = new User({name, email, password:hashedPassword, otp, otpExpiry});
        // const user = new User({name, email, password:hashedPassword});
        await user.save();
        await sendEmail(email,"Your OTP code", `Your OTP is ${otp}`);
        res.status(httpStatus.CREATED).json({message:"Otp send to your email", success:true});
        // res.status(httpStatus.CREATED).json({message:"user registered", success:true, user});

    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message});
    }
}

const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body;
        if(!email || !otp) return res.json({message:"All feilds is required", success: false});

        const user = await User.findOne({email});
        if(!user || !user.otp || user.otpExpiry < Date.now()) return res.json({message:"Invalid or expire OTP", success:false});

        if(otp !== user.otp) return res.json({message:"Invalid OTP", success: false});

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        res.status(httpStatus.CREATED).json({message:"Email verified successfully", success: true, user});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password ) return res.json({message:"All fields are required", success:true});

        const user = await User.findOne({email});
        if(!user) return res.json({message:"User not found", success:false});
        if(!user.isVerified) return res.json({message: "User not verified",success:false});

        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch) return res.json({message:"Inavalid credentials", success: false})
        
        const token = createSecretToken(user._id);
        res.status(httpStatus.OK).json({message:"User Login successfully", token, user, success:true})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const getUserProfile = async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user) return res.json({message:"User not found", success:false});

        res.status(httpStatus.OK).json({message:"User founded", user, success:true})
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


export {register, verifyOtp, login, getUserProfile};