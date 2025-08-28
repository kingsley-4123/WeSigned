import { generateRegistrationOptions, verifyRegistrationResponse,} from '@simplewebauthn/server';
import { User } from '../models/user.js';
import { toB64, fromB64 } from '../utils/b64.js';
import { isoUint8Array } from '@simplewebauthn/server/helpers'; 
// --- 1) REGISTRATION (create a biometric-bound credential) ---

// Step A: Get registration options
export async function getRegistrationOptions (userId) {
  if (!userId) return res.status(401).json({ error: 'User not available.' });

  const user = await User.findById(userId);
  const options = await generateRegistrationOptions({
    rpName: process.env.RP_NAME,
    rpID: process.env.RP_ID,
    userID: isoUint8Array.fromUTF8String(user._id.toString()),
    userName: user.email,
    // Encourage true biometrics on the same device
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'required',
      authenticatorAttachment: 'platform', // prefer platform (TouchID/FaceID/Android)
    },
    attestationType: 'none', // keep simple (no attestation privacy headaches)
    excludeCredentials: user.credentials.map((cred) => ({
      id: fromB64(cred.credentialID),
      type: 'public-key',
      transports: cred.transports || [],
    })),
  });
  
  return options;
};


// Step B: Verify registration response and SAVE PUBLIC KEY
export async function verifyRegResponse (req, res)  {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  const user = await User.findById(userId);
  const expectedChallenge = user.currentChallenge;

  const verification = await verifyRegistrationResponse({
    response: req.body, // object from the browser
    expectedChallenge,
    expectedOrigin: process.env.ORIGIN,
    expectedRPID: process.env.RP_ID,
  });

  if (!verification.verified) return res.status(400).json({ ok: false });

    const { registrationInfo } = verification;
    if (!registrationInfo) return res.status(400).json({ error: 'Invalid registration response' });
    // Ensure the user has a valid registrationInfo
    if (!registrationInfo.credentialID || !registrationInfo.credentialPublicKey) {
      return res.status(400).json({ error: 'Missing credential information' });
    }
    // Ensure the credentialID and credentialPublicKey are valid
    if (typeof registrationInfo.credentialID !== 'string' || typeof registrationInfo.credentialPublicKey !== 'string') {
      return res.status(400).json({ error: 'Invalid credential format' });
    }
    // Ensure the counter is a number
    if (typeof registrationInfo.counter !== 'number') {
      return res.status(400).json({ error: 'Invalid counter value' });
    }

  const {
      credentialID, 
      credentialPublicKey,
      counter,
  } = registrationInfo;

    // 👇 THIS is where you "store the public key" (and related info) in DB
    user.credentials.push({
    credentialID: toB64(credentialID),
    credentialPublicKey: toB64(credentialPublicKey),
    counter,
    transports: req.body?.response?.transports || [],
    deviceLabel: req.headers['user-agent']?.slice(0, 80) || 'Unknown Device',
  });
    // Clear the challenge after successful registration
    user.currentChallenge = undefined;
    // Save the user with the new credential
    await user.save();
    // Generate JWT token for the user
    const token = user.generateToken();

    // Send the token in the response header and JSON body
    res.header('x-auth-token', token).json({ ok: true, userId, credentialID: toB64(credentialID) });
    // ✅ At this point the user is registered with a biometric-bound credential
}