import { getRegistrationOptions } from "./web-authn-registration.js";
import { User } from "../models/user.js";
import lodash from 'lodash'

export default async function reRegister(req, res){
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: "Username taken." });

        res.json({
        user: lodash.pick(user, ['firstname', 'middlename', 'surname', 'email']),
        options
    });
}
