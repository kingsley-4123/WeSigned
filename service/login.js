import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import Joi from "joi";
import lodash from "lodash";

async function verifyUser(req, res) {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "Invalid email or password." });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ message: "Invalid email or password." });

  if (user.status === 'pending') return res.status(400).json({ message: "Account not activated" });

  const token = user.generateToken();

  res.json({
    ok: true,
    userId: user._id,
    user: lodash.pick(user, ["firstname", "middlename", "surname", "email"]),
    token
  });
}

function validateLogin(credentials) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(credentials);
}

export default verifyUser;
