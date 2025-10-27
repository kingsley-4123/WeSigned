import { User, validateUser } from "../models/user.js";
import bcrypt from "bcrypt";
import lodash from 'lodash';

async function createUser(req, res) {
    const { error } = validateUser(req.body.user);
    if (error) return res.status(400).json({message: error.details[0].message});

    const existByEmail = await User.findOne({ email: req.body.user.email });
    if (!existByEmail) {
        let user = new User(lodash.pick(req.body.user, ['firstname', 'middlename', 'surname', 'email', 'school']));
        user.password = await bcrypt.hash(req.body.user.password, 12);
        
        user = await user.save();
        const userID = user._id;
        const token = user.generateToken();

        res.json({
            userID,
            ok: true,
            token
        });

    } else {
        res.status(400).json({ message: "User already registered." });
    }
}

export default createUser;