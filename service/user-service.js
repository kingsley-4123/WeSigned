import { User, validateUser } from "../models/user.js";
import bcrypt from 'bcrypt';
import { getRegistrationOptions } from "./web-authn-registration.js";
import lodash from 'lodash';

async function createUser(req, res) {
    const { error } = validateUser(req.body.user);
    if (error) return res.status(400).send(error.details[0].message);

    const existByEmail = await User.findOne({ email: req.body.user.email });
    if (existByEmail) return res.status(400).send('Email Taken.');

    let user = new User(lodash.pick(req.body.user, ['firstname', 'middlename', 'surname', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, 12);
    user.device_id = req.body.deviceId;
    user.currentChallenge = undefined; // initialize currentChallenge
    user.credentials = []; // initialize credentials array
    req.session.userId = user._id; // store user ID in session
    
    user = await user.save(user);
    if (!user) return res.status(500).send('User not created.');
    // Generate registration options for WebAuthn
    const options = await getRegistrationOptions(user._id);
    user.currentChallenge = options.challenge; // Store challenge for later verification
    await user.save(); // Save the challenge in the user document
    res.json({
        user: lodash.pick(user, ['_id', 'firstname', 'middlename', 'surname', 'email', 'device_id']),
        options: options,
    });

}

export default createUser;