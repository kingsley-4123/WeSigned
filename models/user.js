import mongoose from "mongoose";
import Joi from "joi";
import jwt from 'jsonwebtoken';

const CredentialSchema = new mongoose.Schema({
  credentialID: { type: String, required: true },          // base64url
  credentialPublicKey: { type: String, required: true },   // base64url
  counter: { type: Number, default: 0 },
  transports: [String],                                     // optional
  deviceLabel: { type: String },                            // optional (e.g., "John’s Phone")
}, { _id: false });

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    middlename: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    surname: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    },
    device_id: {
        type: String,
        required: true
    },
    currentChallenge: String,          // store last challenge to verify
    credentials: [CredentialSchema],
});

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXP});
}

export const User = mongoose.model('users', userSchema);

export function validateUser(user) {
    const schema = Joi.object({
        firstname: Joi.string().min(5).max(50).required(),
        middlename: Joi.string().min(5).max(50).required(),
        surname: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).required()
    });

    return schema.validate(user);
}