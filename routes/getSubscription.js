import { Router } from "express";
import { User } from "../models/user.js";
import { Transaction } from "../models/transaction.js";
import auth from "../middlewares/auth.js";
const router = Router();

router.get("/", auth, async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Fetch the latest successful transaction for the user
        const latestTransaction = await Transaction.findOne({ payedBy: userId, status: "success" }).sort({ createdAt: -1 });
        if (!latestTransaction) {
            return res.status(403).json({ message: 'No valid transaction found. Please renew to continue.' });
        }
        
        const start = latestTransaction.createdAt;
        const expiration = latestTransaction.expires;
        res.status(200).json({ message: "Success", start, expiration });
        
    } catch (err) {
        console.error('Error while fetching subscription:', err);
        res.status(500).json({ message: 'Server error/Subscription fetch error.' });
    }
});

export default router;