import mongoose from "mongoose";
import Joi, { required } from "joi";

const transactionSchema = new mongoose.Schema({
  payedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  transactionReference: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  email: { type: String, required: true },
  expires: { type: Date, required: true },
  description: {type: String, required: true},
  currency: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending | success | failed
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model("Transaction", transactionSchema);

//amount, currency, customerEmail, customerName, customerPhone, description

export function validateTransaction(data) {
  const schema = Joi.object({
    amount: Joi.number().required(),
    customerEmail: Joi.string().email().required(),
    customerName: Joi.string().required(),
    description: Joi.string().required(),
    currency: Joi.string().required(),
    customerPhone: Joi.string().required(),
  });

  return schema.validate(data);
}

