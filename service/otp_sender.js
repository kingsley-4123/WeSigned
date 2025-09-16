import { OTP } from "../models/otp.js";

async function sendOTPMail(email, otp) {
    const url = 'https://api.useplunk.com/v1/send';
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PLUNK_SECRET_KEY}`},
        body: JSON.stringify({
            to: email,
            subject: otp,
            body: "Your code expires in 5 minutes."
        }), 
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
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
    const otp = otpGenerator();

    const newOTP = new OTP({
        email: userEmail,
        otp,
        expires: Date.now() + 5 * 60 * 1000
    });
    await newOTP.save();

    const result = await sendOTPMail(userEmail, otp);
    return res.json({ message: result });
}

export async function verifyOTP(req, res) {
    const { otp } = req.body;
    console.log("OTP verification Email", userEmail);
    
    const user = await OTP.findOne({ email: userEmail, otp: otp });
    console.log("OTP", otp);
    console.log("User Otp", user.otp);
    console.log(typeof user.otp, typeof otp);
    if (!user) return res.status(400).json({ success: false, message: "User not available." });
    if (user.expires < Date.now()) return res.status(400).json({success: false, message: "OTP code expired."});
    if(user.otp !== otp) return res.status(400).json({success: false, message: "Invalid Code."});
    
    await OTP.deleteOne({ email: userEmail });
    res.json({ success: true, message: "OTP verified successfully", email: userEmail });
}