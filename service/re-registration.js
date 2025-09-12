import { getRegistrationOptions } from "./web-authn-registration.js";
import { User } from "../models/user.js";

export default async function reRegister(req, res){
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User not available." });

    if (user.credentials.length === 0) return res.status(400).json({ message: "Invalid request." });

    req.session.userId = user._id; // store user ID in session

    const options = await getRegistrationOptions(user._id);
    user.currentChallenge = options.challenge; // Store challenge for later verification
    await user.save(); // Save the challenge in the user document
    res.json({
        user: lodash.pick(user, ['firstname', 'middlename', 'surname', 'email']),
        options
    });
}
