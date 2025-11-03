import { User, validateUser } from "../models/user.js";
import lodash from 'lodash'
import agenda from "../startup/agenda.js";

export default async function reRegister(req, res){
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { firstname, middlename, surname, email, password, school } = req.body;

    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists." });
    }
    
    const user = await User.create({
        firstname,
        middlename,
        surname,
        email,
        school,
        password: await bcrypt.hash(password, 12),
        status: 'pending'
    });

    await agenda.schedule('in 12 hours', 'activate pending user', {userId: user._id});

    res.json({
        message: "Re-registration successful. Account will activate in 12 hours.",
        ok: true,
        userId: user._id
    });
}
