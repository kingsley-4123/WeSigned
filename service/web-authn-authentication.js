import { generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { User } from '../models/user.js';
import { toB64, fromB64 } from '../utils/b64.js';

// Step A: Get authentication options
async function getAuthenticationOptions(userId) {
    if (!userId) return res.status(401).json({ error: 'User not available.' })
  
    const user = await User.findById(userId);
    if (!user.credentials.length) {
        return res.status(400).json({ error: 'No registered credential' });
    }

    const opts = await generateAuthenticationOptions({
        rpID: process.env.RP_ID,
        userVerification: 'required',
        allowCredentials: user.credentials.map((cred) => ({
            id: fromB64(cred.credentialID),
            type: 'public-key',
            transports: cred.transports || [],
        })),
    });

    return opts;
};


// Step B: Verify authentication response
async function verifyAuthResponse (req, res) {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.credentials.length) return res.status(400).json({ error: 'No registered credential' });

    if (!user.currentChallenge) return res.status(400).json({ error: 'No current challenge available' });

    // Ensure the user has a valid currentChallenge
    if (typeof user.currentChallenge !== 'string') return res.status(400).json({ error: 'Invalid challenge format' });

    const expectedChallenge = user.currentChallenge;

    // Find the matching authenticator by credentialID
    const credID = toB64(req.body.rawId);
    const authenticator = user.credentials.find(c => c.credentialID === credID);
    if (!authenticator) return res.status(400).json({ error: 'Unknown credential' });

    const verification = await verifyAuthenticationResponse({
        response: req.body,
        expectedChallenge,
        expectedOrigin: process.env.ORIGIN,
        expectedRPID: process.env.RP_ID,
        authenticator: {
            credentialID: fromB64(authenticator.credentialID),
            credentialPublicKey: fromB64(authenticator.credentialPublicKey),
            counter: authenticator.counter,
            transports: authenticator.transports || [],
        },
    });

    if (!verification.verified) return res.status(400).json({ ok: false });

    // Update signature counter (replay protection)
    authenticator.counter = verification.authenticationInfo.newCounter;
    user.currentChallenge = undefined;
    await user.save();
    const token = user.generateToken();
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    // Return user ID and authentication status
    res.json({
        ok: true,
        userId: user._id,
        authenticated: true,
        token, // Return the JWT token
    });
    // ✅ At this point the user is strongly authenticated via biometrics
};

export { getAuthenticationOptions, verifyAuthResponse };
