import { OTP } from "../models/otp.js";
import {User} from "../models/user.js";
import bcrypt from "bcrypt";

async function sendOTPMail(email, otp, subject) {
    const url = 'https://api.useplunk.com/v1/send';
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PLUNK_SECRET_KEY}`},
        body: JSON.stringify({
            to: email,
            subject,
            body: `Your OTP ${otp}. Code expires in 5 minutes.`
        }), 
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log('EMAIL SENDING', data);
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }    
}

function otpGenerator() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let userEmail;

export async function sendOTP(req, res) {
    userEmail = req.body.email;
    const { subject, type } = req.body;
    if (type !== 'signup' && type !== 'reReg') {
        const user = await User.findOne({ email: userEmail });
        if (!user) return res.status(400).json({ message: "User not registered.", ok: false });    
    }

    const otp = otpGenerator();

    const newOTP = new OTP({
        email: userEmail,
        otp,
        expires: Date.now() + 5 * 60 * 1000
    });
    await newOTP.save();

    const result = await sendOTPMail(userEmail, otp, subject);
    return res.json({ message: result, ok: true });
}

export async function verifyOTP(req, res) {
    const { otp } = req.body;
    console.log("OTP verification Email", userEmail);
    
    const user = await OTP.findOne({ email: userEmail, otp: otp });
    console.log("OTP", otp);
    if (!user) return res.status(400).json({ success: false, message: "User not available." });

    console.log("User Otp", user.otp);
    console.log(typeof user.otp, typeof otp);
    if (user.expires < Date.now()) return res.status(400).json({success: false, message: "OTP code expired."});
    if(user.otp !== otp) return res.status(400).json({success: false, message: "Invalid Code."});
    
    await OTP.deleteOne({ email: userEmail });
    res.json({ success: true, message: "OTP verified successfully", email: userEmail });
}

export async function updatePassword(req, res) {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User not available." });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({message: "Password updated successfully.", ok: true});
}