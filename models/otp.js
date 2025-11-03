import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        maxlength: 6,
        minlength: 6,
        required: true
    },
    expires: {
        type: Number,
        required: true
    }
});

export const OTP = mongoose.model('OTP', otpSchema);