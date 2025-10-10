import axios from 'axios';
import { nanoid } from "nanoid";
import {Transaction, validateTransaction} from "../models/transaction.js"; // path to your schema
import getSubscriptionExpiryTimestamp from '../utils/subscription-timestamp.js';
import dotenv from "dotenv";
import mongoose from 'mongoose';  
dotenv.config();

export async function createPaymentIntent(req, res) {
  try {
    const { error } = validateTransaction(req.body);
    if (error) {
      console.log('Validation error: ', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const randomReference = `ref-${nanoid(20)}`;
    const { amount, currency, customerEmail, customerName, customerPhone, description } = req.body;
    const paymentData = JSON.stringify({
      amount,
      paymentReference: randomReference,
      paymentMethods: "card,bank-transfer,ussd,qrcode",
      customerName,
      customerEmail,
      customerPhoneNumber: customerPhone,
      redirectUrl: "https://example.com",
      description,
      currency,
      feeBearer: "customer",
      metadata: {
        firstname: customerName.split(" ")[0],
        lastname: customerName.split(" ")[1],
        email: customerEmail
      }
    });

    const response = await axios.post(`${process.env.ERCASPAY_TEST_URL}/payment/initiate`, paymentData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ERCASPAY_TEST_SECRET_KEY}`
      }
    });

    console.log('Initiate payment response: ',response);
    // check if the response was successful, if not, return a response to the client.
    if (!response.data.requestSuccessful) {
      return res.status(400).json({
        message: response.data.responseMessage,
        error: response.data.errorMessage,
      });
    }

    const id = new mongoose.Types.ObjectId();

    await Transaction.create({
      payedBy: id, // replace with actual user ID from req.user.id after implementing auth middleware
      transactionReference: response.data.responseBody.transactionReference,
      amount,
      email: customerEmail,
      description,
      currency,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      status: "pending"
    });
    return res.status(200).json({
      message: "Transaction initiated successfully",
      checkoutUrl: response.data.responseBody.checkoutUrl,
    });
        
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
}


// Webhook endpoint
export async function paymentWebhook(req, res) {
  try {
    console.log("Webhook received:", req.body);
    const payload = req.body; // webhook payload from ErcasPay
    const { transaction_reference } = payload;
    
    // Step 1: Check if this reference exists in your DB
    const txn = await Transaction.findOne({ transactionReference: transaction_reference });

    if (!txn) {
      console.warn("Unknown transactionReference:", transaction_reference);
      return res.status(400).json({ message: "Invalid transaction reference" });
    }

    // Step 2: Verify with ErcasPay
    const verify = await axios.get(
      `${process.env.ERCASPAY_TEST_URL}/payment/transaction/verify/${transaction_reference}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ERCASPAY_TEST_SECRET_KEY}`
        },
      }
    );

    const verified = verify.data;

    // Step 3: Update DB based on verified status
    if (verified.responseBody.status === "SUCCESSFUL") {
      console.log("Verification response data:", verify.data);
      txn.status = "success";
      const description = txn.description.toLowerCase();
      const duration = getSubscriptionExpiryTimestamp(description);
      // Update user's subscription in your user DB here
      txn.expires = duration;
      txn.createdAt = Date.now();
    } else {
      console.log("Payment not successful:", verified);
      txn.status = "failed";
    }

    await txn.save();

    // Always respond 200 so ErcasPay knows you received the webhook
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

