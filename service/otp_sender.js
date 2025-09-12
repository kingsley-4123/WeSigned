import { OTP } from "../models/otp.js";

async function sendOTPMail(email, otp) {
    const url = 'https://api.useplunk.com/v1/send';
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PLUNK_SECRET_KEY}`},
        body: `{to:${email}, subject:${otp}, body: Your OTP is ${otp}. It expires in 5 minutes. }`
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

export async function sendOTP(req, res) {
    const email = req.body.email;
    const otp = otpGenerator();

    const newOTP = new OTP({
        email,
        otp,
        expires: Date.now() + 5 * 60 * 1000
    });
    await newOTP.save();

    const result = await sendOTPMail(email, otp);
    return res.json({ message: result });
}

export async function verifyOTP(req, res) {
    const { email, otp } = req.body;
    const user = await OTP.findOne({ email: email });
    if (!user || user.otp !== otp || user.expires < Date.now()) {
        return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
    }
    
    await OTP.deleteOne({ email: email });
    res.json({ success: true, message: "OTP verified successfully" });
}