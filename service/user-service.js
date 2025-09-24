import { User, validateUser } from "../models/user.js";
import bcrypt from 'bcrypt';
import { getRegistrationOptions } from "./web-authn-registration.js";
import lodash from 'lodash';

async function createUser(req, res) {
    const { error } = validateUser(req.body.user);
    if (error) return res.status(400).send(error.details[0].message);

    const existByEmail = await User.findOne({ email: req.body.user.email });
    if (!existByEmail) {
        let user = new User(lodash.pick(req.body.user, ['firstname', 'middlename', 'surname', 'email', 'password']));
        user.password = await bcrypt.hash(user.password, 12);
        user.currentChallenge = undefined; // initialize currentChallenge
        user.credentials = []; // initialize credentials array
        req.session.userId = user._id; // store user ID in session
        
        user = await user.save();
        if (!user) return res.status(500).send('User not created.');
        // Generate registration options for WebAuthn
        const options = await getRegistrationOptions(user._id);
    
        user.currentChallenge = options.challenge; // Store challenge for later verification
        await user.save(); // Save the challenge in the user document
        const userID = bcrypt.hash(user._id, 12);
        res.json({
            user: lodash.pick(user, ['firstname', 'middlename', 'surname', 'email']),
            userID,
            options
        });
    } else if (existByEmail && existByEmail.credentials.length === 0) {
        req.session.userId = existByEmail._id; // store user ID in session
    
        const options = await getRegistrationOptions(existByEmail._id);
    
        existByEmail.currentChallenge = options.challenge; // Store challenge for later verification
        await existByEmail.save(); // Save the challenge in the user document
        const userID = bcrypt.hash(existByEmail._id, 12);
        res.json({
            user: lodash.pick(existByEmail, ['firstname', 'middlename', 'surname', 'email']),
            userID,
            options
        });
    } else {
        res.status(400).json({ message: "User already registered." });
    }
}

export default createUser;