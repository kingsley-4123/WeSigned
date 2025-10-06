import { User } from '../models/user.js';
import { Transaction } from '../models/transaction.js';

export default async function checkSub(req, res, next) {
	try {
		// You may need to adjust this depending on how you attach user info to req
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
        if (!latestTransaction || latestTransaction.expires < Date.now()) {
            return res.status(403).json({ message: 'Subscription expired or no valid transaction found. Please renew to continue.' });
        }
		
		// Subscription is valid, proceed
		next();
	} catch (err) {
		console.error('Subscription check error:', err);
		res.status(500).json({ message: 'Server error' });
	}
}
