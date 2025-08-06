import User from "../models/user_models.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from 'bcrypt';
import { createSecretToken } from '../utils/secretToken.js';
import httpStatus from 'http-status';
import dotenv from 'dotenv';
import { OAuth2Client } from "google-auth-library";

dotenv.config();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ message: "Email or name must required", success: false });
        }
        const userExist = await User.findOne({ email });
        if (userExist && userExist.isVerified) {
            return res.json({ message: "User already exist", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        if (userExist && !userExist.isVerified) {
            userExist.name = name;
            userExist.password = hashedPassword;
            userExist.otp = otp;
            userExist.otpExpiry = otpExpiry;
            await userExist.save();
        } else {
            const user = new User({ name, email, password: hashedPassword, otp, otpExpiry });

            await user.save();
        }

        await sendEmail(email, "Your OTP code", `Your OTP is ${otp}`);
        res.status(httpStatus.CREATED).json({ message: "Otp send to your email", success: true });


    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.json({ message: "All feilds is required", success: false });

        const user = await User.findOne({ email });
        if (!user || !user.otp || user.otpExpiry < Date.now()) return res.json({ message: "Invalid or expire OTP", success: false });

        if (otp !== user.otp) return res.json({ message: "Invalid OTP", success: false });

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        const token = createSecretToken(user._id);
        return res.status(httpStatus.OK).json({ success: true, message: "Verified", token, user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);
        return res.status(httpStatus.OK).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.json({ message: "All fields are required", success: true });

        const user = await User.findOne({ email });
        if (!user) return res.json({ message: "User not found", success: false });
        if (!user.isVerified) return res.json({ message: "User not verified", success: false });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.json({ message: "Inavalid credentials", success: false })

        const token = createSecretToken(user._id);
        res.status(httpStatus.OK).json({ message: "User Login successfully", token, user, success: true })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const otpLogin = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: "email required" });

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        const user = await User.findOne({email});
        if (!user) {
            user = new User({ name: email, email, otp, otpExpiry });
        }else{
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }
        await user.save();

        await sendEmail(email, "Login OTP", `Your login OTP is ${otp}`);
        return res.json({ success: true, message: "OTP sent" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const googleLogin = async (req, res) => {
  const { Token } = req.body;
  
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken:Token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        isVerified: true,
        password: "", // or hashed googleId
        socialId: googleId,
        socialProvider: "google"
      });
    }

    const token = createSecretToken(user._id);
    res.json({ success: true, user, token });

  } catch (error) {
    res.json({ success: false, message: "Google token invalid" });
  }
};

export { register, login, verifyOtp, resendOtp, otpLogin, googleLogin }