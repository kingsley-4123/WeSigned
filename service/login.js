import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import Joi from 'joi';
import { getAuthenticationOptions } from './web-authn-authentication.js';

async function verifyUser(req, res) {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).send('Invalid email.');

    req.session.userId = user._id; // Store user ID in session

    const authOptions = await getAuthenticationOptions(user._id);
    if (!authOptions) return res.status(400).send('No authentication options available.');
    user.currentChallenge = authOptions.challenge; // Store challenge for later verification
    await user.save();
    // Return authentication options to the clientR
    res.json({
        authOptions,
        userId: user._id,
    });

}

function validateLogin(credentials) {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required()
    });

    return schema.validate(credentials);
}

export default verifyUser;